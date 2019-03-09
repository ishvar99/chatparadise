var expect=require('expect');
var isRealString=require('../helpers/validation')
describe('is real string',()=>{
	it('should be a string',()=>{
		var res=isRealString(98);
		expect(res).toBe(false);
	});
	it('should reject string with white spaces',()=>{
		var res=isRealString('  ');
		expect(res).toBe(false);
	});
	it('should accept string with non-space characters',()=>{
		var res=isRealString('test');
		expect(res).toBe(true);
	})
})