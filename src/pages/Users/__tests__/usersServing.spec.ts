import {nothing, some} from '@ryandur/sand';
import {usersServer} from '../usersServer';
import {usersServing} from '../usersServing';
import {workersContainer} from '@pages/Users/__test_support';

const heard = () => {
  const outcomes: string[] = [];
  return {
    reaching: {reached: () => outcomes.push('reached'), unreachable: () => outcomes.push('unreachable')},
    outcomes: () => outcomes
  };
};

describe('reaching the users server', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a page without service workers reaches the server at once', () => {
    const {reaching, outcomes} = heard();

    usersServing.reach(nothing(), reaching);

    expect(outcomes()).toEqual(['reached']);
  });

  test('a page the server already controls reaches it at once, without registering it again', () => {
    const container = workersContainer({controlled: true});
    const {reaching, outcomes} = heard();

    usersServing.reach(some(container.workers), reaching);

    expect(outcomes()).toEqual(['reached']);
    expect(container.registered()).toBe(0);
  });

  test('a server registered but not yet in control is asked to claim the page', async () => {
    const container = workersContainer();

    usersServing.reach(some(container.workers), heard().reaching);
    await vi.advanceTimersByTimeAsync(0);

    expect(container.posted()).toEqual([usersServer.loadedUncontrolled]);
  });

  test('a page the server takes control of within the wait reaches it, and only that', async () => {
    const container = workersContainer();
    const {reaching, outcomes} = heard();
    usersServing.reach(some(container.workers), reaching);
    await vi.advanceTimersByTimeAsync(3000);

    container.takeControl();
    await vi.advanceTimersByTimeAsync(10_000);

    expect(outcomes()).toEqual(['reached']);
  });

  test('a page the server never takes control of finds it unreachable after ten seconds', async () => {
    const container = workersContainer();
    const {reaching, outcomes} = heard();
    usersServing.reach(some(container.workers), reaching);
    await vi.advanceTimersByTimeAsync(9999);
    expect(outcomes()).toEqual([]);

    await vi.advanceTimersByTimeAsync(1);

    expect(outcomes()).toEqual(['unreachable']);
  });

  test('a server that cannot be registered is unreachable, once', async () => {
    const container = workersContainer({registering: Promise.reject(new Error('refused'))});
    const {reaching, outcomes} = heard();

    usersServing.reach(some(container.workers), reaching);
    await vi.advanceTimersByTimeAsync(10_000);

    expect(outcomes()).toEqual(['unreachable']);
  });

  test('a wait that is stopped reports nothing', async () => {
    const container = workersContainer();
    const {reaching, outcomes} = heard();
    const stop = usersServing.reach(some(container.workers), reaching);

    stop();
    container.takeControl();
    await vi.advanceTimersByTimeAsync(10_000);

    expect(outcomes()).toEqual([]);
  });
});
