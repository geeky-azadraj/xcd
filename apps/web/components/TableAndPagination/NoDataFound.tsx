import React from 'react';
import { FileText } from 'lucide-react';

const NoDataFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FileText className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
      <p className="text-sm text-gray-500">No records match your current filters.</p>
    </div>
  );
};

export default NoDataFound;

