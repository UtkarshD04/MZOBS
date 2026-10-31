import test from 'node:test'
import assert from 'node:assert/strict'
import { DRAFT_CANDIDATE_STORIES as stories } from '../src/lib/candidateStories.js'

test('there are draft stories to show', () => {
  assert.ok(stories.length > 0)
})
