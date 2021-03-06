const capitalize = require('lodash.capitalize')
const { a, h3, span, ul, li, em, h4 } = require('../../helpers/tags')
const icon = require('./icon.tmpl')
const timeago = require('./timeago.tmpl')
const c = require('../../helpers/content').get

function hasValue(val) {
  return typeof val !== 'undefined' && val !== null
}

const shared = {
  previewName({ name, kind, url, labelKind, cardKindLabel }) {
    const label = labelKind
      ? cardKindLabel
        ? span(
            { className: 'preview__kind-label' },
            icon(kind),
            ' ',
            `${capitalize(cardKindLabel)} ${capitalize(kind)}`
          )
        : span(
            { className: 'preview__kind-label' },
            icon(kind),
            ' ',
            capitalize(kind)
          )
      : icon(kind)
    return url ? h3(label, ' ', a({ href: url }, name)) : h3(label, ' ', name)
  },

  previewCreated(created) {
    return created ? timeago(created, { right: true }) : null
  },

  previewStatus(status) {
    return status
      ? span(
          { className: `preview__status--${status}` },
          icon(
            status === 'accepted'
              ? 'good'
              : status === 'blocked'
                ? 'bad'
                : status === 'declined' ? 'bad' : 'progress'
          ),
          ' ',
          capitalize(status)
        )
      : null
  },

  previewAvailable(available) {
    return hasValue(available)
      ? available
        ? span({ className: 'preview__available' }, icon('good'), ' Available')
        : span({ className: 'preview__hidden' }, icon('bad'), ' Hidden')
      : null
  },

  previewLanguage(language) {
    return language
      ? span({ className: 'preview__language' }, 'Language: ', em(c(language)))
      : null
  },

  previewCommon({ created, status, available, language }) {
    return [
      shared.previewCreated(created),
      shared.previewStatus(status),
      shared.previewAvailable(available),
      shared.previewLanguage(language),
    ]
  },

  previewRequires(requires) {
    // url name id
    return requires && requires.length
      ? [
          h4('Requires'),
          ul(
            requires.map(require =>
              li(
                require.url
                  ? a({ href: require.url }, require.name || require.id)
                  : require.name || require.id
              )
            )
          ),
        ]
      : null
  },

  previewTags(tags) {
    return tags && tags.length ? span(`Tags: ${tags.join(', ')}`) : null
  },
}

module.exports = shared
