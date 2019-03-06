const expect=require('expect');
const generateMessage=require('../helpers/message')
describe('generateMessage',()=>{
  it('should generate the correct message object',()=>{
  	  var from='Ishan',
  	      text='Hello';
  	  var message=generateMessage(from,text)
  	  expect(typeof message.createdAt).toBe('number')
  	  expect(message).toMatchObject({from,text})
  })
})