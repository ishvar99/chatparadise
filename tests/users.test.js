const expect=require('expect');
const {Users}=require('../public/users')
describe('Users',()=>{
	var users;
	beforeEach(()=>{
		users=new Users();
       users.users=[{
       	id:'123',
			name:'priya',
			room:'room1'
       },{
       	id:'456',
			name:'rakesh',
			room:'room2'
		},
		{
			id:'789',
			name:'nitin',
			room:'room1'
		}];
	})
	it('It should add new user',()=>{
		var users=new Users();
		var user={
			id:'123',
			name:'priya',
			room:'room1'
		};
		var resUser=users.addUser(user.id,user.name,user.room);
		expect(users.users).toEqual([resUser]);
	});
	it('It should get a user by ID',()=>{
		var id='123';
            var user=users.getUser(id);
            expect(user.id).toBe(id);
	});
	it('It should not find a user',()=>{
		var id='234';
		expect(users.getUser(id)).toBe(undefined);
	})
	it('It should remove a user',()=>{
		var id='123';
		var user=users.removeUser(id);
		expect(user.id).toBe(id);
		expect(users.users.length).toBe(2);
	});
	it('It should not remove a user',()=>{
		var id='132';
		var user=users.removeUser(id);
		expect(user).toBe(undefined);
		expect(users.users.length).toBe(3);
	});
	it('It should find users in room1',()=>{
		var room='room1';
		var userList=users.getUsersList(room);
		expect(userList).toEqual(['priya','nitin']);
	})
});