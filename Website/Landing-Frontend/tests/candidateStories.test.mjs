import test from 'node:test'
import assert from 'node:assert/strict'
import { DRAFT_CANDIDATE_STORIES as stories } from '../src/lib/candidateStories.js'

test('there are draft stories to show', () => {
  assert.ok(stories.length > 0)
})

test('every story has a unique id', () => {
  const ids = stories.map((s) => s.id)
  assert.equal(new Set(ids).size, ids.length)
})
