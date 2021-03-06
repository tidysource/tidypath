'use strict';

/*
Setup testing environment
=========================
*/
//Testing modules
var test = require('tidytest');

//Module to test
var path = require('../index.js');

/*
Tests
=====
*/
test('lvls()', function(assert){	//<--- won't handle relative lvls, like ./ or ../ --> use path.resolve?
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
    assert.plan(6);

	assert.equal(path.ext('foo.txt'), '.txt');
	assert.equal(path.ext('./foo.txt'), '.txt');
	assert.equal(path.ext('foo/bar.ver7.txt'), '.txt');
	assert.equal(path.ext('foo/bar'), '');
	assert.equal(path.ext('.txt'), '');
	assert.equal(path.ext('./.txt'), '');
});

test('rmExt()', function(assert){
    assert.plan(5);

	assert.equal(path.rmExt('foo.txt'), 'foo');
	assert.equal(path.rmExt('./foo.txt'), './foo');
	assert.equal(path.rmExt('foo/bar.ver7.txt'), 'foo/bar.ver7');
	assert.equal(path.rmExt('foo/bar'), 'foo/bar');
	assert.equal(path.rmExt('.txt'), '.txt');
});

test('dotfile()', function(assert){
    assert.plan(12);

	assert.equal(path.dotfile('foo.txt'), '');
	assert.equal(path.dotfile('./foo/bar'), '');
	assert.equal(path.dotfile('./foo.txt'), '');
	assert.equal(path.dotfile('foo/.bar/hello.txt'), '',
							'dotfolder');
	assert.equal(path.dotfile('foo/bar.ver7.txt'), '');
	assert.equal(path.dotfile('foo/.bar'), '.bar');
	assert.equal(path.dotfile('.txt'), '.txt');
	assert.equal(path.dotfile('.foo.txt'), '.foo.txt');
    assert.equal(path.dotfile('foo/.bar.txt'), '.bar.txt');
	assert.equal(path.dotfile('./'), '');
	assert.equal(path.dotfile('.'), '');
    assert.equal(path.dotfile(''), '');
});

test('file()', function(assert){
    assert.plan(11);

	assert.equal(path.file('foo.txt'), 'foo.txt');
	assert.equal(path.file('./foo.txt'), 'foo.txt');
	assert.equal(path.file('foo.ver100.txt'), 'foo.ver100.txt');
	assert.equal(path.file('foo/bar.txt'), 'bar.txt');
	assert.equal(path.file('foo/.bar/hello.txt'), 'hello.txt',
							'dotfolder');
	assert.equal(path.file('.bar/'), '',
							'dotfolder');
	assert.equal(path.file('foo/.bar/hello'), '',
							'dotfolder');
	assert.equal(path.file('.dotfile'), '.dotfile');
	assert.equal(path.file('foo/.dotfile'), '.dotfile');
	assert.equal(path.file('foo/bar'), '')
	assert.equal(path.file(''), '');
});

test('filename()', function(assert){
    assert.plan(11);

    assert.equal(path.filename('foo.txt'), 'foo.txt');
    assert.equal(path.filename('./foo.txt'), 'foo.txt');
    assert.equal(path.filename('foo.ver100.txt'), 'foo.ver100.txt');
    assert.equal(path.filename('foo/bar.txt'), 'bar.txt');
    assert.equal(path.filename('foo/.bar/hello.txt'), 'hello.txt',
                            'dotfolder');
    assert.equal(path.filename('.bar/'), '',
                            'dotfolder');
    assert.equal(path.filename('foo/.bar/hello'), '',
                            'dotfolder');
    assert.equal(path.filename('.dotfile'), '.dotfile');
    assert.equal(path.filename('foo/.dotfile'), '.dotfile');
    assert.equal(path.filename('foo/bar'), '')
    assert.equal(path.filename(''), '');
});

test('tree()', function(assert){
    assert.plan(14);

	assert.equal(path.tree('./hello/world.txt'), './hello');
	assert.equal(path.tree('hello/world/foo.txt'), 'hello/world');
	assert.equal(path.tree('hello/world'), 'hello/world');		//--
	assert.equal(path.tree('hello/world/'), 'hello/world/');	//--- Should make trailing slash uniform?
	assert.equal(path.tree('hello/world/.foo'), 'hello/world');	//--
	assert.equal(path.tree('./foo.txt'), '.');
	assert.equal(path.tree('foo.txt'), '');
	assert.equal(path.tree('./foo.bar.txt'), '.');
	assert.equal(path.tree('.dotfile'), '');
	assert.equal(path.tree('.dotfile.txt'), '');
	assert.equal(path.tree('./.dotfile.txt'), '.');
    assert.equal(path.tree('./.dotfile.bar.txt'), '.');
    assert.equal(path.tree('foo/.bar/hello'), 'foo/.bar/hello',
                                'dotfolder');
	assert.equal(path.tree(''), '');
});

test('parent()', function(assert){
    assert.plan(14);

    assert.equal(path.parent('./hello/world.txt'), './hello');
    assert.equal(path.parent('hello/world/foo.txt'), 'hello/world');
    assert.equal(path.parent('hello/world'), 'hello');		//--
    assert.equal(path.parent('hello/world/'), 'hello');	//--- Should make trailing slash uniform?
    assert.equal(path.parent('hello/world/.foo'), 'hello/world');	//--
    assert.equal(path.parent('./foo.txt'), '.');
    assert.equal(path.parent('foo.txt'), '');
    assert.equal(path.parent('./foo.bar.txt'), '.');
    assert.equal(path.parent('.dotfile'), '');
	assert.equal(path.parent('.dotfile.txt'), '');
    assert.equal(path.parent('./.dotfile.txt'), '.');
    assert.equal(path.parent('./.dotfile.bar.txt'), '.');
    assert.equal(path.parent('foo/.bar/hello'), 'foo/.bar',
                                'dotfolder');
    assert.equal(path.parent(''), '');
});

test('filter()', function(assert){
    assert.plan(6);

	var paths = [
		'hello.js',
		'hello/world.txt',
		'.dot',
		0
	];
	//Same as var path without 0
	var onlyStrings = paths.slice(0,-1);
	//No .js files
	var noJS = paths.slice(1,-1);

	assert.deepEqual(path.filter('./hello.txt', '.txt'), ['./hello.txt']);
	assert.deepEqual(path.filter(paths, '.js'), ['hello.js']);
	assert.deepEqual(path.filter(paths, ['.js']), ['hello.js']);
	assert.deepEqual(path.filter(paths, path.dotfile), ['.dot']);
	assert.deepEqual(path.filter(paths), onlyStrings);
	assert.deepEqual(path.filter(paths, '.js', false), noJS);
});

test('isFile()', function(assert){
    assert.plan(10);

	assert.equal(path.isFile('./hello/world.txt'), true);
	assert.equal(path.isFile('hello/world/foo.txt'), true);
	assert.equal(path.isFile('hello/world'), false);
	assert.equal(path.isFile('hello/world/.foo'), true);
	assert.equal(path.isFile('./foo.txt'), true);
	assert.equal(path.isFile('foo.txt'), true);
	assert.equal(path.isFile('.dotfile'), true);
	assert.equal(path.isFile('./'), false);
	assert.equal(path.isFile('.'), false);
	assert.equal(path.isFile(''), false);
});

test('separator', function(assert){
    assert.plan(1);

	assert.equal(path.separator, path.sep);
});
