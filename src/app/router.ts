let registered = false;
export const registerRoutes = (
  routes: Record<string, string | ((...params: unknown[]) => unknown)>,
  update: (view: unknown) => void
) => {
  if (registered) {
    return;
  }
  registered = true;

  const tests = [] as ((path: string) => unknown)[];
  const maps = {} as Record<string, string>;
  for (const route of Object.keys(routes)) {
    const view = routes[route];

    if (typeof view === 'string') {
      maps[route] = view;
    } else {
      const parts = route.split('/');
      const regexStr = parts.reduce((result, part) => {
        if (part.startsWith(':')) {
          part = `(.*?)`;
        }
        return result ? `${result}\\/${part}` : part;
      }, '');
      const regex = new RegExp(regexStr + '$');
      tests.push((path: string) => {
        const matches = path.match(regex);
        if (!matches) {
          return null;
        }
        const params = matches?.slice(1);
        return view(...params);
      });
    }
  }

  const handleRoute = () => {
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    const path = maps[hash] ?? hash;

    for (const test of tests) {
      const view = test(path);
      if (view) {
        return view === 'redirect' ? null : update(view);
      }
    }
  };

  window.addEventListener('DOMContentLoaded', handleRoute);
  window.addEventListener('hashchange', handleRoute);
};
