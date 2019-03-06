const expect=require('expect');
const {generateMessage}=require('../helpers/message')
const {generateLocationMessage}=require('../helpers/message')
describe('generateMessage',()=>{
  it('should generate the correct message object',()=>{
  	  var from='Ishan',
  	      text='Hello'
  	  var message=generateMessage(from,text)
  	  expect(typeof message.createdAt).toBe('number')
  	  expect(message).toMatchObject({from,text})
  })
})
describe('generateLocationMessage',()=>{
	it('should generate the correct message location',()=>{
		var from='admin',
		lat=13,
		lon=27,
		url='https://www.google.com/maps?q=13,27';
		var message=generateLocationMessage(from,lat,lon)
		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from,url});
	})
})