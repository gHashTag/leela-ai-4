import { log } from 'matchstick-as'
import {
  CommentAction as CommentActionEvent,
  DiceRolled as DiceRolledEvent,
  PlayerAction as PlayerActionEvent,
  ReportAction as ReportActionEvent,
  RollDiceError as RollDiceErrorEvent
} from '../generated/LeelaGame/LeelaGame'
import { CommentAction, DiceRolled, PlayerAction, ReportAction, RollDiceError } from '../generated/schema'
import { Bytes } from '@graphprotocol/graph-ts'

export function handleCommentAction(event: CommentActionEvent): void {
  let entity = new CommentAction(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.commentId = event.params.commentId
  entity.reportId = event.params.reportId
  entity.actor = event.params.actor
  entity.content = event.params.content
  entity.timestamp = event.params.timestamp
  entity.action = event.params.action

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDiceRolled(event: DiceRolledEvent): void {
  let entity = new DiceRolled(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.roller = event.params.roller
  entity.rolled = event.params.rolled
  entity.currentPlan = event.params.currentPlan

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePlayerAction(event: PlayerActionEvent): void {
  let playerEntityId = event.transaction.hash.concatI32(event.logIndex.toI32())
  let entity = new PlayerAction(playerEntityId)

  entity.player = event.params.player
  entity.fullName = event.params.fullName
  entity.avatar = event.params.avatar
  entity.intention = event.params.intention
  entity.action = event.params.action

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReportAction(event: ReportActionEvent): void {
  let playerActionId = event.params.actor.toHex()
  let playerActionEntity = new PlayerAction(Bytes.fromHexString(playerActionId))

  log.info('playerActionEntity:', [playerActionEntity])

  let entity = new ReportAction(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.reportId = event.params.reportId
  entity.actor = event.params.actor
  entity.content = event.params.content
  entity.plan = event.params.plan
  entity.timestamp = event.params.timestamp
  entity.action = event.params.action
  entity.playerAction = playerActionEntity
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}
export function handleRollDiceError(event: RollDiceErrorEvent): void {
  let entity = new RollDiceError(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.message = event.params.message

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
