const repo = require("../repo/queue");
const errExep = require("../errExep");
exports.booking = async (title,detail, auth_id, room_id, date) => {
  console.log(title,detail, auth_id, room_id, date);
  
  const id = await repo.create(title,detail, auth_id, room_id, 0, date);
  return { id: id, title,detail, room: room_id, date };
};

exports.listing = async (role, room, year, month) => {
  let queues;
  if (role == 0 || role == 1) {
    queues = await repo.listing(year, month, room, [0, 1]);
  } else {
    queues = await repo.listing(year, month, room, [1]);
  }
  //  console.log(queues)
  if (queues.length == 0 || !queues) {
    return { result: [], room };
  }
  let pre_queue = queues[0];
  let some_date = [];
  let cut_date = [];
  for (const queue of queues) {
    if (queue.date.getTime() != pre_queue.date.getTime()) {
      cut_date.push(some_date);
      some_date = [];
    }
    pre_queue = queue;
    some_date.push(queue);
  }
  cut_date.push(some_date);

  let result = [];
  for (const dates of cut_date) {
    let isApprove = false;
    for (const date of dates) {
      if (date.status == 1) {
        isApprove = true;
      }
    }
    if (isApprove) {
      result.push({ date: dates[0].date, status: 1 });
    } else {
      result.push({ date: dates[0].date, status: 0 });
    }
  }

  return { result, room };
};

exports.get_by_date = async (role, room, date) => {
  let queues;
  if (role == 0 || role == 1) {
    queues = await repo.get_by_date(date, room, [0, 1]);
  } else {
    queues = await repo.get_by_date(date, room, [1]);
  }
  return queues;
};

exports.approve = async (queue_id, date, room) => {
  const on_date = await repo.get_by_date(date, room, [0, 1]);
  if (on_date.length == 0 || !on_date) {
    throw new Error(errExep.APPROVE_FAIL);
  }
  let is_have = false;
  for (const queue of on_date) {
    if (queue.id == queue_id) {
      is_have = true;
    }
  }
  if (!is_have) throw new Error(errExep.APPROVE_FAIL);
  for (const queue of on_date) {
    if (queue.id == queue_id) {
      await repo.update_status(queue.id, 1);
    } else {
      await repo.update_status(queue.id, 2);
    }
  }
};

exports.cancal = async (queue_id, date, room) => {
  const on_date = await repo.get_by_date(date, room, [1, 2]);
  if (on_date.length == 0 || !on_date) {
     throw new Error(errExep.CANCAL_FAIL);
  }
  let is_have = false;
  for (const queue of on_date) {
    if (queue.id == queue_id) {
      is_have = true;
    }
  }
  if (!is_have) throw new Error(errExep.CANCAL_FAIL);
  for (const queue of on_date) {
      await repo.update_status(queue.id, 0);
  }
};
