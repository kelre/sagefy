{header, span, h1, ul, li} = require('../../modules/tags')
c = require('../../modules/content').get
{ucfirst} = require('../../modules/auxiliaries')

module.exports = (kind, entity) ->
    title = ucfirst(kind)
    if kind is 'card'
        title = ucfirst(entity.kind) + ' ' + title

    return header(
        {className: 'entity-header'}
        span({className: 'entity-header__kind'}, title)
        h1(entity.name)
    )
