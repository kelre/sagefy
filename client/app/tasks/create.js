/* eslint-disable camelcase, no-alert */
const cloneDeep = require('lodash.clonedeep')

module.exports = store => {
  const { getState, dispatch, getTasks } = store
  return store.addTasks({
    resetCreate() {
      dispatch({ type: 'RESET_CREATE' })
    },

    updateCreateRoute({ kind, step }) {
      dispatch({ type: 'UPDATE_CREATE_ROUTE', kind, step })
    },

    createSubjectData(values) {
      dispatch({
        type: 'CREATE_SUBJECT_DATA',
        values,
      })
    },

    addMemberToCreateSubject({ kind, id, name, body }) {
      dispatch({
        type: 'ADD_MEMBER_TO_CREATE_SUBJECT',
        kind,
        id,
        name,
        body,
      })
    },

    addMemberToAddUnits({
      id,
      version,
      name,
      body,
      language = 'en',
      require_ids = [],
    }) {
      dispatch({
        type: 'ADD_MEMBER_TO_ADD_UNITS',
        id,
        version,
        name,
        body,
        language,
        require_ids,
      })
    },

    addMemberToAddCards(values) {
      dispatch({
        type: 'ADD_MEMBER_TO_ADD_CARDS',
        values,
      })
    },

    removeMemberFromCreateSubject({ id }) {
      // TODO-2 switch to undo
      if (window.confirm('Remove member?')) {
        dispatch({
          type: 'REMOVE_MEMBER_FROM_CREATE_SUBJECT',
          id,
        })
      }
    },

    removeUnitFromSubject({ index }) {
      // TODO-2 switch to undo
      if (window.confirm('Remove unit?')) {
        dispatch({
          type: 'REMOVE_UNIT_FROM_SUBJECT',
          index,
        })
      }
    },

    removeCardFromUnit({ index }) {
      // TODO-2 switch to undo
      if (window.confirm('Remove card?')) {
        dispatch({
          type: 'REMOVE_CARD_FROM_UNIT',
          index,
        })
      }
    },

    createChooseSubjectForUnits({ id, name }) {
      dispatch({
        type: 'CREATE_CHOOSE_SUBJECT_FOR_UNITS',
        id,
        name,
      })
    },

    createChooseUnitForCards({ id, name }) {
      dispatch({
        type: 'CREATE_CHOOSE_UNIT_FOR_CARDS',
        id,
        name,
      })
    },

    stowProposedUnit({ name, language, body, require_ids }) {
      dispatch({
        type: 'STOW_PROPOSED_UNIT',
        name,
        language,
        body,
        require_ids,
      })
    },

    stowProposedCard(values) {
      dispatch({
        type: 'STOW_PROPOSED_CARD',
        values,
      })
    },

    addRequireToProposedUnit({ id, name, body, kind }) {
      dispatch({
        type: 'ADD_REQUIRE_TO_PROPOSED_UNIT',
        id,
        name,
        body,
        kind,
      })
    },

    createSubjectProposal(data) {
      let topicId
      let subjectId
      getTasks()
        .createTopic({ topic: data.topic })
        .then(topicResponse => {
          topicId = topicResponse.topic.id
          return getTasks().createNewSubjectVersion(data.subject)
        })
        .then(subjectResponse => {
          const post = cloneDeep(data.post)
          post.topic_id = topicId
          post.entity_versions = [
            {
              kind: 'subject',
              id: subjectResponse.version.version_id,
            },
          ]
          subjectId = subjectResponse.version.entity_id
          return getTasks().createPost({ post })
        })
        .then(() => getTasks().route(`/subjects/${subjectId}`))
    },

    createUnitsProposal() {
      const state = getState()
      const { selectedSubject } = state.create
      const topic = {
        name: 'Add Units to This Subject',
        entity_id: selectedSubject.id,
        entity_kind: 'subject',
      }

      let topicId
      let unitVersionIds
      return getTasks()
        .createTopic({ topic })
        .then(topicResponse => {
          topicId = topicResponse.topic.id
          const newUnits = state.create.units.filter(unit => !unit.id)
          return getTasks().createNewUnitVersions(newUnits)
        })
        .then(unitsResponse => {
          const existingUnitIds = state.create.units
            .map(unit => unit.id)
            .filter(unitId => unitId)
          const newUnitIds = unitsResponse.units.map(unit => unit.entity_id)
          const unitIds = [].concat(existingUnitIds, newUnitIds)

          const existingUnitVersionIds = state.create.units
            .map(unit => unit.version)
            .filter(version => version)
          const newUnitVersionIds = unitsResponse.units.map(
            unit => unit.version_id
          )
          unitVersionIds = [].concat(existingUnitVersionIds, newUnitVersionIds)

          const subject = {
            entity_id: selectedSubject.id,
            members: unitIds.map(unitId => ({
              kind: 'unit',
              id: unitId,
            })),
          }
          return getTasks().createExistingSubjectVersion(subject)
        })
        .then(subjectResponse => {
          const post = {
            kind: 'proposal',
            body: 'Add Units to Subject',
            topic_id: topicId,
            entity_versions: [
              {
                kind: 'subject',
                id: subjectResponse.version.version_id,
              },
            ].concat(
              unitVersionIds.map(unitId => ({
                id: unitId,
                kind: 'unit',
              }))
            ),
          }
          return getTasks().createPost({ post })
        })
        .then(() => getTasks().route(`/subjects/${selectedSubject.id}`))
    },

    createCardsProposal() {
      const state = getState()
      const { selectedUnit } = state.create
      const topic = {
        name: 'Add Cards to This Unit',
        entity_id: selectedUnit.id,
        entity_kind: 'unit',
      }
      let topicId
      return getTasks()
        .createTopic({ topic })
        .then(topicResponse => {
          topicId = topicResponse.topic.id
          let { cards } = state.create
          cards = cards.map(card =>
            Object.assign({}, card, {
              unit_id: selectedUnit.id,
            })
          )
          return getTasks().createNewCardVersions(cards)
        })
        .then(cardsResponse => {
          const post = {
            kind: 'proposal',
            body: 'Add Cards to Unit',
            topic_id: topicId,
            entity_versions: cardsResponse.cards.map(card => ({
              id: card.version_id,
              kind: 'card',
            })),
          }
          return getTasks().createPost({ post })
        })
        .then(() => getTasks().route(`/units/${selectedUnit.id}`))
    },
  })
}
