import { reaction } from "mobx";
import { useCallback, useEffect, useRef } from "react";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Course } from "../store";

Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement, Tooltip);
Chart.defaults.font.family =
  '"Open Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const options = {
  scales: {
    xAxis: {
      ticks: {
        callback: (_: any, index: number) => index,
        maxRotation: 0,
        sampleSize: 1,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
    },
  },
  clip: false,
  interaction: {
    intersect: false,
    axis: "x" as "x",
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    line: {
      cubicInterpolationMode: "monotone" as "monotone",
      // tension: 0.5,
    },
  },
};

const LineChart = ({ course, className }: { course: Course; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const processMarks = useCallback(() => {
    return {
      labels: course.assessments.map(a => a.name),
      data: course.assessments.map(a => (a.mark / a.total) * 100),
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { labels, data } = processMarks();
    const chart = new Chart(ref.current!, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data,
            fill: false,
            backgroundColor: "rgb(251, 113, 133)",
            borderColor: "rgba(251, 113, 133, 0.2)",
          },
        ],
      },
      options,
    });

    reaction(
      () => course.assessments,
      () => {
        const { labels: newLabels, data: newData } = processMarks();
        chart.data.labels = newLabels;
        chart.data.datasets[0].data = newData;
        chart.update();
      },
    );
    // eslint-disable-next-line
  }, [processMarks]);

  return <canvas ref={ref} className={className} width={512} height={300} />;
};

export default LineChart;
