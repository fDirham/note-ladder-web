import { useRouter } from "next/dist/client/router";
import React from "react";

export default function LadderPage() {
  const router = useRouter();
  const { user, ladder } = router.query;

  return (
    <div>
      user: {user}
      ladder: {ladder}
    </div>
  );
}
