import * as sdk from 'botpress/sdk'

import { NLUDS, PipelineProcessManager } from './typings'

export class PipelineManager implements PipelineProcessManager {
  private _nluds: NLUDS = {} as NLUDS
  private _pipeline: Function[] = [] as Function[]

  private _reducer = async (ds: Promise<NLUDS>, fn: Function): Promise<NLUDS> => fn(await ds)

  public of(pipeline: Function[]): PipelineProcessManager {
    this._pipeline = pipeline
    return this
  }

  public initDS(text: string, includedContexts: string[]): PipelineProcessManager {
    this._nluds = initNLUDS(text, includedContexts)
    return this
  }

  public async run(): Promise<NLUDS> {
    if (!this._nluds) {
      throw new Error('You must add a NLUDS to the pipeline manager before runinng it')
    }

    if (!this._pipeline) {
      throw new Error('You must add a pipeline to the pipeline manager before runinng it')
    }

    return await this._pipeline.reduce(this._reducer, Promise.resolve(this._nluds))
  }
}

export const initNLUDS = (text: string, includedContexts: string[]): NLUDS => {
  return {
    rawText: text,
    lowerText: '',
    includedContexts: includedContexts,
    language: '',
    entities: [],
    intents: [],
    intent: {} as sdk.NLU.Intent,
    sanitizedText: '',
    tokens: [],
    slots: {}
  }
}
