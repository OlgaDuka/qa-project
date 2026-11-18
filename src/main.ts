const helloPrefix: string = 'Hello'

function greet(name: string): string {
  return `${helloPrefix}, ${name}!`
}

console.log(greet('World'))
