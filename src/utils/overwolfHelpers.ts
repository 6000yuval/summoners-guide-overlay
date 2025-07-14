// Helper utilities for Overwolf development and deployment

export const isOverwolfApp = (): boolean => {
  return typeof window !== 'undefined' && !!window.overwolf;
};

export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const getOverwolfVersion = (): string | null => {
  if (!isOverwolfApp()) return null;
  
  return new Promise((resolve) => {
    window.overwolf.extensions.current.getManifest((result: any) => {
      resolve(result.meta?.version || 'unknown');
    });
  }) as any;
};

export const logOverwolfEvent = (event: string, data?: any): void => {
  if (isDevelopmentMode()) {
    console.log(`[Overwolf Event] ${event}`, data);
  }
};

export const openDevTools = (): void => {
  if (isOverwolfApp() && isDevelopmentMode()) {
    window.overwolf.windows.getCurrentWindow((result: any) => {
      if (result.status === 'success') {
        window.overwolf.windows.openDevTools(result.window.id);
      }
    });
  }
};

export const getGameInfo = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isOverwolfApp()) {
      resolve(null);
      return;
    }

    window.overwolf.games.getRunningGameInfo((result: any) => {
      if (result.status === 'success') {
        resolve(result);
      } else {
        reject(new Error(result.reason || 'Failed to get game info'));
      }
    });
  });
};

export const showNotification = (title: string, message: string): void => {
  if (isOverwolfApp()) {
    window.overwolf.windows.displayMessageBox(title, message, () => {});
  } else {
    // Fallback for development
    if (isDevelopmentMode()) {
      console.log(`[Notification] ${title}: ${message}`);
    }
  }
};

// Window management helpers
export const minimizeCurrentWindow = (): void => {
  if (!isOverwolfApp()) return;
  
  window.overwolf.windows.getCurrentWindow((result: any) => {
    if (result.status === 'success') {
      window.overwolf.windows.minimize(result.window.id);
    }
  });
};

export const closeCurrentWindow = (): void => {
  if (!isOverwolfApp()) return;
  
  window.overwolf.windows.getCurrentWindow((result: any) => {
    if (result.status === 'success') {
      window.overwolf.windows.close(result.window.id);
    }
  });
};

export const maximizeCurrentWindow = (): void => {
  if (!isOverwolfApp()) return;
  
  window.overwolf.windows.getCurrentWindow((result: any) => {
    if (result.status === 'success') {
      window.overwolf.windows.maximize(result.window.id);
    }
  });
};

export const restoreCurrentWindow = (): void => {
  if (!isOverwolfApp()) return;
  
  window.overwolf.windows.getCurrentWindow((result: any) => {
    if (result.status === 'success') {
      window.overwolf.windows.restore(result.window.id);
    }
  });
};