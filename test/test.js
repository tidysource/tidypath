'use strict';

/*
Setup testing environment
=========================
*/
//Testing modules
var test = require('tape');
var colorize = require('tap-colorize');
var colorizeOptions = {
	pass : '#B2D9B5',
	fail : '#FE5A4E',
	info : '#EEEEEE'
};
test.createStream()
	.pipe(colorize(colorizeOptions))
	.pipe(process.stdout);

//Module to test
var path = require('../index.js');

/*
Tests
=====
*/
test('lvls()', function(assert){
    assert.plan(3);
	
	var paths = [
		'hello',
		'foo/bar',
		'hello/world',
		'hello/world/tidy/'	
	]
	
	var depth = path.lvls(paths);

	assert.deepEqual(depth[0], ['hello']);
	assert.deepEqual(depth[1], ['foo/bar','hello/world']);
	assert.deepEqual(depth[2], ['hello/world/tidy/']);
});

test('byDepth()', function(assert){
    assert.plan(1);
	
	var paths = [
		'hello',
		'hello/world/foo/bar',
		'hello/world/tidy/', //ignores trailing separator
		'hello/world',
		'foo/bar'
	]
	
	var sorted = path.byDepth(paths);
	
	assert.deepEqual(sorted, 
					[
					'hello',
					'foo/bar',
					'hello/world',
					'hello/world/tidy/',	//won't remove trailing separator
					'hello/world/foo/bar'
					]);
});

test('ext()', function(assert){
    assert.plan(4);
	
	assert.equal(path.ext('foo.txt'), '.txt');
	assert.equal(path.ext('foo/bar.ver7.txt'), '.txt');
	assert.equal(path.ext('foo/bar'), '');
	assert.equal(path.ext('.txt'), '');
});

test('rmExt()', function(assert){
    assert.plan(4);
	
	assert.equal(path.rmExt('foo.txt'), 'foo');
	assert.equal(path.rmExt('foo/bar.ver7.txt'), 'foo/bar.ver7');
	assert.equal(path.rmExt('foo/bar'), 'foo/bar');
	assert.equal(path.rmExt('.txt'), '.txt');
});