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

test('every story has a unique name', () => {
  const names = stories.map((s) => s.name)
  assert.equal(new Set(names).size, names.length)
})

test('every story has a name, tagline and feedback', () => {
  for (const s of stories) {
    for (const key of ['name', 'tagline', 'feedback']) {
      assert.equal(typeof s[key], 'string', `${s.id}: ${key} must be a string`)
      assert.ok(s[key].trim().length > 0, `${s.id}: ${key} must not be empty`)
    }
  }
})
