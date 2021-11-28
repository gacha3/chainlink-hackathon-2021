import { useCallback, useEffect } from 'react'
import { useQuery } from 'react-query'
import { PunkGacha } from '../../abi'
import { TypedEvent, TypedEventFilter, TypedListener } from '../../abi/common'

export default function useQueryFilterAndListener<
  TEvent extends TypedEvent,
  SimpleEvent extends any,
>(options: {
  key: string
  filter: TypedEventFilter<TEvent> | undefined
  listener: TypedListener<TEvent>
  punkGachaContract: PunkGacha
  eventModifier: (events: TEvent[]) => SimpleEvent[]
}) {
  const { key, filter, punkGachaContract, listener, eventModifier } = options

  // fetcher
  const fetcher = useCallback(async () => {
    if (!filter) return
    const events = await punkGachaContract.queryFilter(filter)
    return eventModifier(events)
  }, [eventModifier, filter, punkGachaContract])

  // query
  const query = useQuery(key, fetcher, { enabled: !!filter })

  // listener
  useEffect(() => {
    if (!filter) return
    console.log(`${key} event listener on`)
    punkGachaContract.on(filter, listener)
    return () => {
      console.log(`${key} event listener off`)
      punkGachaContract.off(filter, listener)
    }
  }, [filter, key, punkGachaContract, listener])

  return query
}
