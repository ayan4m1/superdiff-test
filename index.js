import Benchmark from "benchmark";
import diff from "deep-diff";
import { getObjectDiff } from "@donedeal0/superdiff";
import { faker } from "@faker-js/faker";

const prepare = () => {
  const result = [];

  for (let i = 0; i < 10000; i++) {
    const leftObj = {
      id: faker.random.numeric(8),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: faker.address.streetAddress(),
      phoneNumber: faker.phone.number(),
    };

    const rightObj = { ...leftObj };
    const propToModify = Math.floor(Math.random() * 5);

    switch (propToModify) {
      case 0:
        rightObj.id = faker.random.numeric(8);
        break;
      case 1:
        rightObj.firstName = faker.name.firstName();
        break;
      case 2:
        rightObj.lastName = faker.name.lastName();
        break;
      case 3:
        rightObj.address = faker.address.streetAddress();
        break;
      case 4:
        rightObj.phoneNumber = faker.phone.number();
        break;
    }

    result.push([leftObj, rightObj]);
  }

  return result;
};

const benchmark = () => {
  const data = prepare();
  const suite = new Benchmark.Suite("superdiff");

  suite
    .add("superdiff", () => {
      for (const [left, right] of data) {
        getObjectDiff(left, right);
      }
    })
    .add("deep-diff", () => {
      for (const [left, right] of data) {
        diff(left, right);
      }
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: true });
};

benchmark();
