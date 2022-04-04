export type XlsxMetricData = {
  action: string;
  name: string;
  sections?: XlsxMetricSection[];
};

export type XlsxMetricSection = {
  title: string;
  description: string;
};
