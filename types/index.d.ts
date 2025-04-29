interface Habit {
  historyDwell:   number;
  transferDwell: number;
  dashboardDwell: number;
  pinSpeed: number;
}

interface Anomaly {
  type: string;
  severity:     string;
  timeDetected: dateTime;
}

interface User {
  id:        string;
  email: string;
  name: string?;
  password: string?;
  habits:    Habit;
  anomalies: Anomaly[]
}
