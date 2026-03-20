import type { toolFunction } from "./toolFunction.interface" 

export interface toolCall {
  id: string,
  type: string
  function: toolFunction
}
