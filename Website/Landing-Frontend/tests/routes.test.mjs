import test from 'node:test'
import assert from 'node:assert/strict'
import { CLIENT_ONLY_ROUTES as R } from '../src/lib/routes.js'

test('the routes the landing sections link to exist', () => {
  for (const key of ['candidates', 'employeeSignup', 'employeeApplications', 'employeeSubscription']) {
    assert.equal(typeof R[key], 'string', `${key} is missing`)
    assert.ok(R[key].startsWith('/'), `${key} must be an absolute path`)
  }
})
