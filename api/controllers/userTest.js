const { Review, Perfume, User, UserTest, Fragrance } = require("../../models");
const { Op } = require("sequelize");

/*
1:1,
2:1,
3:1,
4:1,
5:1,
6:1,
7:1,
8:1,
9:1,
10:1,
*/

userTest1 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    console.log("들옴");
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });
    await UserTest.update(
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      { where: { userId: userId } }
    );
    if (userSelect == 1) {
      await UserTest.increment(
        {
          4: 1,
          6: 1,
          8: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    console.log("들옴2");
    if (userSelect == 2) {
      await UserTest.increment(
        {
          2: 1,
          3: 1,
          5: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          1: 1,
          2: 1,
          3: 1,
          5: 1,
          6: 1,
          7: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          8: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    console.log(zz);
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    console.log(com2);

    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 1번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 1번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 1번 중 에러가 발생했습니다",
    });
  }
};
userTest2 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;

  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          2: 1,
          3: 1,
          5: 1,
          7: 1,
          9: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          5: 1,
          7: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          1: 1,
          4: 1,
          6: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          1: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    console.log(sorted);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;

    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 2번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 2번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 2번 중 에러가 발생했습니다",
    });
  }
};

userTest3 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          5: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          2: 1,
          5: 1,
          7: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          8: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          1: 1,
          4: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 3번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 3번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 3번 중 에러가 발생했습니다",
    });
  }
};
userTest4 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          2: 1,
          3: 1,
          5: 1,
          6: 1,
          7: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          2: 1,
          3: 1,
          5: 1,
          7: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          1: 1,
          3: 1,
          4: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          8: 1,
          9: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 4번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 4번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 4번 중 에러가 발생했습니다",
    });
  }
};
userTest5 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          2: 1,
          5: 1,
          7: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          3: 1,
          6: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          1: 1,
          4: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          8: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 5번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 5번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 5번 중 에러가 발생했습니다",
    });
  }
};
userTest6 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          3: 1,
          4: 1,
          6: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          2: 1,
          5: 1,
          7: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          1: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          9: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 6번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 6번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 6번 중 에러가 발생했습니다",
    });
  }
};
userTest7 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          1: 1,
          3: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          2: 1,
          3: 1,
          5: 1,
          7: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          4: 1,
          6: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          1: 1,
          4: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 7번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 7번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 7번 중 에러가 발생했습니다",
    });
  }
};
userTest8 = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          2: 1,
          5: 1,
          7: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          3: 1,
          6: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          1: 1,
          4: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          4: 1,
          8: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");
    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });
    console.log(testResult);
    return res.status(200).json({
      result: `유저 : ${userId}, 8번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 8번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 8번 중 에러가 발생했습니다",
    });
  }
};
userTestResult = async (req, res) => {
  const { userSelect } = req.params;
  const userId = res.locals.users.userId;
  try {
    await UserTest.findOrCreate({
      where: { userId: userId },
      raw: true,
    });

    if (userSelect == 1) {
      await UserTest.increment(
        {
          3: 1,
          10: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 2) {
      await UserTest.increment(
        {
          3: 1,
          6: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 3) {
      await UserTest.increment(
        {
          2: 1,
          5: 1,
          7: 1,
          9: 1,
        },
        { where: { userId: userId } }
      );
    }
    if (userSelect == 4) {
      await UserTest.increment(
        {
          1: 1,
          4: 1,
          8: 1,
        },
        { where: { userId: userId } }
      );
    }

    //최대값 칼럼 3개 찾기(내림차순)
    const zz = await UserTest.findOne({
      where: { userId: userId },
      order: [["userId", "DESC"]],
      raw: true,
    });
    let userTestArray = Object.entries(zz);
    await userTestArray.splice(10, 2);
    let sorted = userTestArray.sort((a, b) => b[1] - a[1]);
    let first = sorted[0][0];
    let second = sorted[1][0];
    let third = sorted[2][0];
    let com = first + "," + second + "," + third;
    let com2 = com.split(",");

    const testResult = await Fragrance.findAll({
      where: { fragId: { [Op.or]: com2 } },
      raw: true,
    });

    //유저정보 업뎃
    const frag1 = testResult[0].fragName;
    const frag2 = testResult[1].fragName;
    const frag3 = testResult[2].fragName;
    await User.update(
      { userFrag: `${frag1},${frag2},${frag3}` },
      { where: { userId: userId } }
    );
    return res.status(200).json({
      result: `유저 : ${userId}, 9번 테스트 ${userSelect}번 선택 `,
      testResult,
    });
  } catch (error) {
    console.log(` 테스트 9번 중 에러: ${error}`);
    return res.status(500).send({
      success: false,
      msg: "테스트 9번 중 에러가 발생했습니다",
    });
  }
};

module.exports = {
  userTest1,
  userTest2,
  userTest3,
  userTest4,
  userTest5,
  userTest6,
  userTest7,
  userTest8,
  userTestResult,
};
