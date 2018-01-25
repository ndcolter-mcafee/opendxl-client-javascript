'use strict'
/* eslint no-unused-expressions: "off" */ // for chai expect assertions

var expect = require('chai').expect
var Buffer = require('safe-buffer').Buffer
var decodeMessage = require('../lib/decode-message')
var Request = require('../dxl-client').Request
var util = require('../lib/util')
var testHelpers = require('./test-helpers')

describe('Request', function () {
  context('when fields are mostly set to defaults', function () {
    it('should preserve all data through serialization', function () {
      var topic = 'my_request_topic'
      var request = new Request(topic)

      expect(request.destinationTopic).to.equal(topic)

      var encodedRequest = request._toBytes()
      expect(Buffer.isBuffer(encodedRequest)).to.be.true

      var decodedRequest = decodeMessage(encodedRequest)
      decodedRequest.destinationTopic = request.destinationTopic
      decodedRequest.payload = testHelpers.decodePayload(decodedRequest)
      expect(decodedRequest).to.be.eql(request)
    })
  })

  context('when all fields have non-default values', function () {
    it('should preserve all data through serialization', function () {
      var request = new Request('my_request_topic')
      request.replyToTopic = 'my reply topic'
      request.serviceId = util.generateIdAsString()
      request.sourceClientId = util.generateIdAsString()
      request.sourceBrokerId = util.generateIdAsString()
      request.payload = 'my request payload'
      request.brokerIds = [
        util.generateIdAsString(),
        util.generateIdAsString()
      ]
      request.clientIds = [ util.generateIdAsString() ]
      request.otherFields = { field1: 'val1', field2: 'val2' }
      request.sourceTenantGuid = util.generateIdAsString()
      request.destinationTenantGuids = [ util.generateIdAsString() ]

      var encodedRequest = request._toBytes()
      expect(Buffer.isBuffer(encodedRequest)).to.be.true

      var decodedRequest = decodeMessage(encodedRequest)
      decodedRequest.destinationTopic = request.destinationTopic
      decodedRequest.payload = testHelpers.decodePayload(decodedRequest)
      expect(decodedRequest).to.be.eql(request)
    })
  })
})