console.log();
console.log(2);

console.log.call();

console.log.apply();

console.log.bind()();

const f1 = console.log;
f1();

const f2 = o => console.log.call(o);
f2({});

const f3 = function (o) {
	console.log.apply(o);
}
f3({});

const f4 = console.log.bind();
f4();

const f5 = console.log.bind()(1);

() => console.log();


const c = console;
c.log(';)');

const arr = [console];
arr[0].log(';)');