const { div, ul, li, input, label } = require('../../helpers/tags')
const format = require('../../helpers/format')

module.exports = (data, mode) => {
  const { body, options } = data.data
  const disabled = mode === 'next-please'

  return [
    div(format(body)),
    ul(
      { className: 'options card-learn__options' },
      options.map(option =>
        li(
          { className: disabled ? 'disabled' : '' },
          input({
            type: 'radio',
            name: 'choice',
            value: option.id,
            id: option.id,
            disabled,
            key: `${data.id}-${option.id}`,
            // The key ensures the input doesn't stay selected
            // when changing questions
          }),
          ' ',
          label(
            {
              htmlFor: option.id,
              disabled,
            },
            format(option.value)
          )
        )
      )
    ),
  ]
}
