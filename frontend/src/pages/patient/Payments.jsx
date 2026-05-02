import { useState, useEffect } from "react";
import { DollarSign, Calendar, CreditCard } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ExportButton from "../../components/ExportButton";
import { PatientPaymentsSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]); // For stats calculation
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    fetchPayments();
    fetchAllPaymentsForStats();
  }, [pagination.currentPage]);

  const fetchPayments = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/patient/payments?page=${page}&limit=${pagination.itemsPerPage}`,
      );
      setPayments(data.data || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0,
      }));
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPaymentsForStats = async () => {
    try {
      // Fetch all payments for stats calculation (without pagination)
      const { data } = await api.get("/patient/payments?all=true");
      setAllPayments(data.data || []);
    } catch (error) {
      // If this fails, we'll use the paginated data for stats
      console.error("Failed to fetch all payments for stats");
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "badge-completed";
      case "pending":
        return "badge-pending";
      case "failed":
        return "badge-cancelled";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPaid = (allPayments.length > 0 ? allPayments : payments)
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = (allPayments.length > 0 ? allPayments : payments)
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransactions =
    allPayments.length > 0 ? allPayments.length : pagination.totalItems;

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {loading ? (
          <PatientPaymentsSkeleton />
        ) : (
          <div className="p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                      Total Paid
                    </p>
                    <h3 className="text-3xl font-bold text-accent mt-2">
                      ${totalPaid}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <DollarSign size={28} className="text-accent" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                      Pending
                    </p>
                    <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                      ${totalPending}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <DollarSign size={28} className="text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                      Total Transactions
                    </p>
                    <h3 className="text-3xl font-bold text-primary mt-2">
                      {totalTransactions}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <CreditCard size={28} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                  Payment History
                </h2>
                <ExportButton
                  data={allPayments.length > 0 ? allPayments : payments}
                  type="payments"
                  title="Payment History Report"
                  filename="payment_history"
                />
              </div>

              {payments.length === 0 ? (
                <EmptyState type="payments" className="py-8" />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                            Transaction ID
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                            Method
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr
                            key={payment._id}
                            className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={16}
                                  className="text-gray-400 dark:text-slate-500"
                                />
                                <span className="text-dark dark:text-slate-100">
                                  {new Date(
                                    payment.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm text-dark dark:text-slate-100">
                              {payment.transactionId || "N/A"}
                            </td>
                            <td className="py-3 px-4 font-bold text-dark dark:text-slate-100">
                              ${payment.amount}
                            </td>
                            <td className="py-3 px-4 text-dark dark:text-slate-100">
                              <span className="capitalize">
                                {payment.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`badge ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
