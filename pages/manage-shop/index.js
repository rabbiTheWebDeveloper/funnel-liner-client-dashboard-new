import React, { useState } from "react";
import Link from "next/link";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

const Index = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px 20px 48px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "24px",
  };

  const cardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "28px 24px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    textDecoration: "none",
    display: "block",
    position: "relative",
    overflow: "hidden",
    color: "inherit",
  };

  const cardHover = {
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    transform: "translateY(-4px)",
    borderColor: "#e5e7eb",
  };

  const iconContainerStyle = {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    fontSize: "24px",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "white",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#111827",
    letterSpacing: "-0.025em",
  };

  const descStyle = {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "0",
  };

  const badgeStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "12px",
    fontWeight: "500",
    padding: "4px 10px",
    borderRadius: "20px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
  };

const cards = [
  {
    title: "Shop Settings",
    desc: "General shop configurations customize your shop's core settings for a seamless experience.",
    icon: "🏬",
    link: "/dashboard-setting",
    badge: "Essential",
  },
  {
    title: "Shop Domain",
    desc: "Manage your shop's core configurations, including domain setup and general settings.",
    icon: "🔗",
    link: "/website-setting?domain=3&redirect_from=panel4",
  },
  {
    title: "Shop Policy",
    desc: "Define and customize policies for your shop, including returns, refunds, and customer service guidelines.",
    icon: "📄",
    link: "/privacy-policy",
    badge: "Important",
  },
  {
    title: "Delivery Support",
    desc: "Manage your shop's delivery settings to ensure smooth and efficient order fulfillment.",
    icon: "🚚",
    link: "/website-setting?tab=5",
  },
  {
    title: "Payment Gateway",
    desc: "Integrate and manage payment options to provide customers with secure and flexible transaction methods.",
    icon: "🏦",
    link: "/payment-gateway",
    badge: "Essential",
  },
  {
    title: "Slider & banner",
    desc: "Enhance your shop's visibility by connecting SEO tools and marketing integrations for better engagement.",
    icon: "📈",
    link: "/home-slider",
  },
  {
    title: "SMS Support",
    desc: "Enable SMS notifications and support to keep your customers informed with real-time updates.",
    icon: "💬",
    link: "/bulk-sms",
  },
  {
    title: "Chat Support",
    desc: "Provide instant communication and assistance to customers with chat support system.",
    icon: "💭",
    link: "/chat-support",
  },
  {
    title: "Social Links",
    desc: "Connect your shop with social media platforms to enhance visibility and engagement.",
    icon: "🔗",
    link: "/dashboard-setting",
  },

  // ✅ NEW ITEMS

  {
    title: "TikTok Pixel Setup",
    desc: "Track user behavior and optimize ad performance by integrating TikTok Pixel with your shop.",
    icon: "🎯",
    link: "/tiktok-pixel",
    badge: "Marketing",
  },
  {
    title: "Microsoft Clarity",
    desc: "Analyze user interactions with session recordings and heatmaps to improve user experience.",
    icon: "📊",
    link: "/microsoft-clarity",
    badge: "Analytics",
  },
];

  return (
    <>
      <HeaderDescription
        headerIcon={"flaticon-product"}
        title={"Manage Shop"}
        subTitle={
          "Set up and customize your shop to ensure a smooth and efficient experience. Configure all aspects of your online store from one centralized dashboard."
        }
        search={false}
        order={false}
      />
      <div style={containerStyle}>
        <div style={gridStyle}>
          {cards.map((card, index) => (
            <Link href={card.link} key={index} legacyBehavior>
              <a
                style={{
                  ...cardStyle,
                  ...(hoveredCard === index ? cardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {card.badge && <span style={badgeStyle}>{card.badge}</span>}
                <div style={iconContainerStyle}>{card.icon}</div>
                <h3 style={titleStyle}>{card.title}</h3>
                <p style={descStyle}>{card.desc}</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
