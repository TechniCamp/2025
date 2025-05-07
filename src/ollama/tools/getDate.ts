import { ToolFunction } from '../toolsLoader'

const functions: ToolFunction[] = [
  {
    type: 'function',
    function: {
      name: 'getDate',
      description: 'Returns the current date.',
    },
    execute: (): Promise<{ value: string }> => {
      return Promise.resolve({
        value: new Date().toISOString(),
      })
    },
  },
]

export default functions
