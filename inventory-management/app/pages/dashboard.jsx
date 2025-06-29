"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="w-full h-screen">
      <iframe
        title="inventory-management"
        src="https://app.powerbi.com/reportEmbed?reportId=bc9c7bbe-5044-4ee8-96dd-eb6dee78c318&autoAuth=true&ctid=7b410031-6333-4080-9e61-afdbd57b3bd9"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}
