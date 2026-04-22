import { useState, useEffect } from "react";
import { DollarSign, Calendar, CreditCard } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/patient/payments");
      setPayments(data.data);
    } catch (error) {
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
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

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Paid
                  </p>
                  <h3 className="text-3xl font-bold text-accent mt-2">
                    ${totalPaid}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={28} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                    ${totalPending}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={28} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Transactions
                  </p>
                  <h3 className="text-3xl font-bold text-primary mt-2">
                    {payments.length}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={28} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-dark mb-6">
              Payment History
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No payment history yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Method
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {payment.transactionId || "N/A"}
                        </td>
                        <td className="py-3 px-4 font-bold text-dark">
                          ${payment.amount}
                        </td>
                        <td className="py-3 px-4">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
