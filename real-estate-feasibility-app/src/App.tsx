import React from "react";
import { useStore } from "./store";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ تحميل موديولات Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const { project, setProject } = useStore();

  // ✅ بيانات الرسم البياني
  const chartData = {
    labels: ["سكني", "تجاري", "مكتبي"],
    datasets: [
      {
        label: "النسبة %",
        data: [
          project.usage.residential,
          project.usage.commercial,
          project.usage.office,
        ],
        backgroundColor: ["#60a5fa", "#34d399", "#fbbf24"],
      },
    ],
  };

  // ✅ بيانات الجدول
  const tableData = [
    { parameter: "Discount Rate %", value: project.financial.discountRate },
    { parameter: "Inflation Rate %", value: project.financial.inflation },
    { parameter: "Rental Growth %", value: project.financial.rentalGrowth },
    { parameter: "Exit Cap Rate %", value: project.financial.exitCap },
    { parameter: "Management Fee %", value: project.financial.managementFee },
    { parameter: "Vacancy Rate %", value: project.financial.vacancy },
  ];

  // ✅ تصدير Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Data");
    XLSX.writeFile(wb, "feasibility-report.xlsx");
  };

  // ✅ تصدير PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("📊 تقرير دراسة الجدوى العقارية", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["المعامل", "القيمة"]],
      body: tableData.map((row) => [row.parameter, row.value]),
    });

    doc.save("feasibility-report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ الهيدر */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            🏢 نظام دراسة الجدوى العقارية المتكامل
          </h1>
          <div className="flex gap-4">
            <button
              onClick={exportExcel}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              📗 تصدير Excel
            </button>
            <button
              onClick={exportPDF}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              📕 تصدير PDF
            </button>
          </div>
        </div>
      </header>

      {/* ✅ القسم العلوي */}
      <section className="container mx-auto mt-6 px-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">بيانات أساسية</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="اسم المشروع"
            value={project.name}
            onChange={(e) => setProject("name", e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="عدد الطوابق"
            value={project.floors}
            onChange={(e) => setProject("floors", Number(e.target.value))}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="FAR"
            value={project.far}
            onChange={(e) => setProject("far", Number(e.target.value))}
            className="border rounded p-2"
          />
        </div>
      </section>

      {/* ✅ نسب الاستخدامات */}
      <section className="container mx-auto mt-8 px-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">نسب الاستخدامات</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="سكني %"
            value={project.usage.residential}
            onChange={(e) =>
              setProject("usage.residential", Number(e.target.value))
            }
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="تجاري %"
            value={project.usage.commercial}
            onChange={(e) =>
              setProject("usage.commercial", Number(e.target.value))
            }
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="مكتبي %"
            value={project.usage.office}
            onChange={(e) =>
              setProject("usage.office", Number(e.target.value))
            }
            className="border rounded p-2"
          />
        </div>
      </section>

      {/* ✅ الرسم البياني */}
      <section className="container mx-auto mt-8 px-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          توزيع الاستخدامات (%)
        </h2>
        <div className="bg-white p-4 shadow rounded-xl">
          <Bar data={chartData} />
        </div>
      </section>

      {/* ✅ التحليل المالي */}
      <section className="container mx-auto mt-8 px-4 mb-10">
        <h2 className="text-xl font-bold text-gray-700 mb-4">التحليل المالي</h2>
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">المعامل المالي</th>
                <th className="px-4 py-2 border">القيمة</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{row.parameter}</td>
                  <td className="border px-4 py-2">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
