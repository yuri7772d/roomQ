const queue = require("../src/usecase/queue");
const repo = require("../src/repo/queue");
const errExep = require("../src/errExep");

jest.mock("../src/repo/queue");


  beforeEach(() => {
    jest.clearAllMocks();   // <-- ใส่ตรงนี้
  });

describe("Queue Service", () => {

  // -----------------------------------
  // booking
  // -----------------------------------
  test("booking(): success", async () => {
    repo.create.mockResolvedValue(10);

    const result = await queue.booking("title", "detail", 1, 2, "2025-01-01");

    expect(repo.create).toHaveBeenCalledWith("title", "detail", 1, 2, 0, "2025-01-01");
    expect(result).toEqual({
      id: 10,
      title: "title",
      detail: "detail",
      room: 2,
      date: "2025-01-01",
    });
  });

  // -----------------------------------
  // listing
  // -----------------------------------
  test("listing(): admin role (0,1) show all status [0,1]", async () => {
    const data = [
      { date: new Date("2025-01-01"), status: 0 },
      { date: new Date("2025-01-01"), status: 1 },
    ];

    repo.listing.mockResolvedValue(data);

    const result = await queue.listing(0, 2, 2025, 1);

    expect(repo.listing).toHaveBeenCalledWith(2025, 1, 2, [0, 1]);
    expect(result.result.length).toBe(1);
    expect(result.result[0]).toEqual({
      date: new Date("2025-01-01"),
      status: 1,
    });
  });

  test("listing(): user role (2) show only status [1]", async () => {
    repo.listing.mockResolvedValue([]);

    const result = await queue.listing(2, 5, 2025, 1);

    expect(repo.listing).toHaveBeenCalledWith(2025, 1, 5, [1]);
    expect(result).toEqual({ result: [], room: 5 });
  });

  test("listing(): multiple dates split correctly", async () => {
    const data = [
      { date: new Date("2025-01-01"), status: 0 },
      { date: new Date("2025-01-02"), status: 0 },
      { date: new Date("2025-01-02"), status: 1 },
    ];

    repo.listing.mockResolvedValue(data);

    const result = await queue.listing(0, 1, 2025, 1);

    expect(result.result).toEqual([
      { date: new Date("2025-01-01"), status: 0 },
      { date: new Date("2025-01-02"), status: 1 },
    ]);
  });

  // -----------------------------------
  // get_by_date
  // -----------------------------------
  test("get_by_date(): admin role calls status [0,1]", async () => {
    repo.get_by_date.mockResolvedValue([{ id: 1 }]);

    const result = await queue.get_by_date(0, 9, "2025-01-01");

    expect(repo.get_by_date).toHaveBeenCalledWith("2025-01-01", 9, [0, 1]);
    expect(result).toEqual([{ id: 1 }]);
  });

  test("get_by_date(): user role calls status [1]", async () => {
    repo.get_by_date.mockResolvedValue([{ id: 1 }]);

    const result = await queue.get_by_date(2, 3, "2025-01-01");

    expect(repo.get_by_date).toHaveBeenCalledWith("2025-01-01", 3, [1]);
  });

  // -----------------------------------
  // approve
  // -----------------------------------
  test("approve(): no queue on date → throw", async () => {
    repo.get_by_date.mockResolvedValue([]);

    await expect(queue.approve(10, "2025-01-01", 1))
      .rejects.toThrow(errExep.APPROVE_FAIL);
  });

  test("approve(): selected queue_id not found → throw", async () => {
    repo.get_by_date.mockResolvedValue([{ id: 99, status: 0 }]);

    await expect(queue.approve(123, "2025-01-01", 1))
      .rejects.toThrow(errExep.APPROVE_FAIL);
  });

  test("approve(): success", async () => {
    const queues = [
      { id: 10, status: 0 },
      { id: 20, status: 0 },
    ];

    repo.get_by_date.mockResolvedValue(queues);

    repo.update_status.mockResolvedValue(true);

    await queue.approve(10, "2025-01-01", 1);

    expect(repo.update_status).toHaveBeenCalledTimes(2);
    expect(repo.update_status).toHaveBeenCalledWith(10, 1);
    expect(repo.update_status).toHaveBeenCalledWith(20, 2);
  });

  // -----------------------------------
  // cancal
  // -----------------------------------
  test("cancal(): no queue → throw", async () => {
    repo.get_by_date.mockResolvedValue([]);

    await expect(queue.cancal(10, "2025-01-01", 1))
      .rejects.toThrow(errExep.CANCAL_FAIL);
  });

  test("cancal(): queue_id not found → throw", async () => {
    repo.get_by_date.mockResolvedValue([{ id: 99 }]);

    await expect(queue.cancal(10, "2025-01-01", 1))
      .rejects.toThrow(errExep.CANCAL_FAIL);
  });

  test("cancal(): success", async () => {
    const queues = [
      { id: 10 },
      { id: 20 },
    ];

    repo.get_by_date.mockResolvedValue(queues);

    repo.update_status.mockResolvedValue(true);

    await queue.cancal(10, "2025-01-01", 1);

    expect(repo.update_status).toHaveBeenCalledTimes(2);
    expect(repo.update_status).toHaveBeenCalledWith(10, 0);
    expect(repo.update_status).toHaveBeenCalledWith(20, 0);
  });

});
