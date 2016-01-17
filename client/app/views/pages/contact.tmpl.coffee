# TODO-3 move copy to content directory

{div, h1, ul, li, a, strong, br} = require('../../modules/tags')

uvUrl = 'https://sagefy.uservoice.com/forums/233394-general'

module.exports = ->
    return div(
        {id: 'contact'}
        h1('Contact Sagefy')
        ul(
            li(
                strong('I have a problem with content.')
                br()
                'Flag it, discuss it, or propose removing it.'
            )
            li(
                strong('I have an idea for content.')
                br()
                'Discuss it in the site.'
            )
            li(
                strong('I have an idea for the software.')
                br()
                a(
                    {href: uvUrl}
                    'Add it to our feedback forum.'
                )
            )
            li(
                strong('I found a bug.')
                br()
                a(
                    {href: 'https://github.com/heiskr/sagefy/issues'}
                    'Add to Github issues'
                )
                ' or '
                a(
                    {href: 'mailto:support@sagefy.org'}
                    'send us an email'
                )
                '.'
            )
            li(
                strong('My copyright has been violated.')
                br()
                'Propose to remove the item. If that doesn\'t work, '
                a(
                    {href: 'mailto:support@sagefy.com'}
                    'send us an email'
                )
                '.'
            )
            li(
                strong('I\'m a media person.')
                br()
                a(
                    {href: 'http://sagefy.totemapp.com/'}
                    'Visit or media page.'
                )
            )
        )
    )
