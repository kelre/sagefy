const {div, h3, ul, li, strong, br, small, p, a} = require('../../modules/tags')
const icon = require('./icon.tmpl')

module.exports = () =>
  div(
    {className: 'entity-info'},
    h3('What are cards, units, and sets?'),
    ul(
      li(
        'A ', icon('card'), ' ', strong('card'),
            ' is a single learning activity.',
        br(),
        small('(Examples: a 3-minute video or a multiple choice question.)')
      ),
      li(
        'A ', icon('unit'), ' ', strong('unit'),
            ' is a single learning goal.',
        br(), small('(Example: "What is mean, median, and mode?")')
      ),
      li(
        'A ', icon('set'), ' ', strong('set'),
            ' is a collection of units and other sets.',
        br(),
        small(
          '(Like a course, but at any scale. ',
          'Such as "Measures of Central Tendency", "Intro to Statistics", ',
          'or even a full degree program.)'
        )
      )
    ),
    p(
      'For more details and examples, ',
      a(
        {href: 'https://youtu.be/HVwfwTOdnOE'},
        'check out this 3-minute overview video'
      ),
      '.'
    )
  )
