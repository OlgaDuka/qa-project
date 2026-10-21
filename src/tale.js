function kolobok(name) {
  const characters = ['лиса', 'дедушка', 'бабушка', 'медведь', 'волк']
  const characters_case = ['Меня съели', 'дедушки', 'бабушки', 'медведя', 'волка']
  const n = characters.indexOf(name)

  if (n !== -1) {
    if (n === 0) {
      return characters_case[0]
    } else {
      return `Я от ${characters_case[n]} ушел`
    }
  }

  return 'Мне встретился персонаж из другой сказки'
}

function kolobok_switch(name) {
  const characters = ['лиса', 'дедушка', 'бабушка', 'медведь', 'волк']
  const characters_case = ['Меня съели', 'дедушки', 'бабушки', 'медведя', 'волка']
  const n = characters.indexOf(name)

  switch (n) {
    case -1:
      return 'Мне встретился персонаж из другой сказки'
    case 0:
      return characters_case[0]
    default:
      return `Я от ${characters_case[n]} ушел`
  }
}

console.log(kolobok('медведь'))
console.log(kolobok('лиса'))
console.log(kolobok('чудо-юдо'))

console.log(kolobok_switch('бабушка'))
console.log(kolobok_switch('лиса'))
console.log(kolobok_switch('чудо-юдо'))

function newYear(name) {
  const characters = ['Дед Мороз', 'Снегурочка']
  const n = characters.indexOf(name)

  switch (n) {
    case -1:
      return 'Кажется, сейчас жаркое лето!'
    default:
      return `${characters[n]}! ${characters[n]}! ${characters[n]}!`
  }
}

console.log(newYear('Снегурочка'))
console.log(newYear('Дед Мороз'))
console.log(newYear('Чунга-чанга'))
