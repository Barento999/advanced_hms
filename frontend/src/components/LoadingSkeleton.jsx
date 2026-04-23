// Reusable skeleton components for loading states

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
    </td>
  </tr>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </th>
          <th className="text-left py-3 px-4">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRowSkeleton key={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export const ReviewCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="space-y-2 mt-3">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="p-8 mt-20">
    <div className="mb-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    <div className="card">
      <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
      <TableSkeleton rows={5} />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="p-8 mt-20">
    <div className="mb-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64"></div>
    </div>

    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j}>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);
