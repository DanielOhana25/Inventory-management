"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="w-full h-screen">
      <iframe
        title="inventory-management"
        src="https://app.powerbi.com/reportEmbed?reportId=9f11d433-59f5-4fc0-b3b2-1eac3a6770d3&autoAuth=true&ctid=7b410031-6333-4080-9e61-afdbd57b3bd9"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}
