{div, h1, ul, li, a, h3, p, span, i, div} = require('../../modules/tags')
c = require('../../modules/content').get
spinner = require('../components/spinner.tmpl')

module.exports = (data) ->
    return spinner() unless data.chooseUnit

    return div(
        {id: 'choose-unit'}
        h1('Choose a Unit')
        ul(
            {id: data.chooseUnit.set.entity_id, className: 'units'}
            li(
                {className: if index is 0 then 'recommended'}
                a(
                    {
                        id: unit.entity_id
                        className: 'choose-unit__engage' + (
                            if index is 0 \
                                then ' choose-unit__engage--first'
                                else ''
                        )
                    }
                    'Engage!'
                )
                div(
                    h3(unit.name)
                    span(
                        {className: 'choose-unit__recommended'}
                        i({className: 'fa fa-star'})
                        ' Recommended'
                    ) if index is 0
                    p(unit.body)
                    # TODO-2 % learned
                )
            ) for unit, index in data.chooseUnit.units.slice(0, 5)
        )
    )
