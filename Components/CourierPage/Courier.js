import Switch from "@mui/material/Switch";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import SuperFetch from "../../hook/Axios";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { activateCourier, headers } from "../../pages/api";
import SmallLoader from "../SmallLoader/SmallLoader";
import CarrybeeCourier from "./CarrybeeCourier";
import Pathao from "./Pathao";
import RedxCourier from "./RedxCourier";

/* ─────────────────────────────────────────────
   Eye-toggle helper (used for Steadfast only)
───────────────────────────────────────────── */
const EyeToggle = ({ visible, onToggle }) => (
    <div className="cb-eye" onClick={onToggle}>
        <i className={visible ? "flaticon-eye" : "flaticon-hidden"} />
    </div>
);

/* ─────────────────────────────────────────────
   Generic courier card wrapper
───────────────────────────────────────────── */
const CourierCard = ({ logo, logoAlt, name, isActive, onToggle, badge, children }) => (
    <div className={`cb-card${isActive ? " cb-card--active" : ""}`}>
        {/* top bar */}
        <div className="cb-card__header">
            <div className="cb-card__logo">
                <img src={logo} alt={logoAlt} />
            </div>
            <div className="cb-card__meta">
                <span className="cb-card__name">{name}</span>
                {isActive && <span className="cb-status cb-status--on">Connected</span>}
                {!isActive && badge && <span className="cb-status cb-status--badge">{badge}</span>}
            </div>
            <div className="cb-card__toggle">
                <Switch
                    checked={isActive}
                    onChange={(e) => onToggle(e.target.checked)}
                    sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#894bca" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#c59ef0" },
                    }}
                />
            </div>
        </div>

        {/* collapsible form area */}
        {isActive && (
            <div className="cb-card__body">
                <div className="cb-divider" />
                {children}
            </div>
        )}
    </div>
);

/* ─────────────────────────────────────────────
   Main Courier component
───────────────────────────────────────────── */
const Courier = ({ busInfo }) => {
    const router = useRouter();
    const showToast = useToast();
    const [isLoading, startLoading, stopLoading] = useLoading();

    // visibility toggles for password fields (Steadfast)
    const [showSfApi, setShowSfApi] = useState(false);
    const [showSfSecret, setShowSfSecret] = useState(false);

    // Pathao secrets toggle (passed down)
    const [showPathaoSecrets, setShowPathaoSecrets] = useState({ sicretKey: false, password: false });

    const data = Cookies.get();
    const mainData = data?.user;
    let parseData;
    if (mainData != null) parseData = JSON.parse(mainData);
    const merchantId = parseData?.id;

    // courier open/closed
    const [openSteadFast, setOpenSteadFast] = useState(false);
    const [openRedx, setOpenRedx] = useState(false);
    const [openPathao, setOpenPathao] = useState(false);
    const [openCarrybee, setOpenCarrybee] = useState(false);

    // stored API configs
    const [steadFastData, setSteadFastData] = useState({});
    const [pathaoData, setPathaoData] = useState();
    const [redxData, setRedxData] = useState({});
    const [carrybeeData, setCarrybeeData] = useState({});

    // Steadfast react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm();

    const decodeJson = (raw) => {
        if (!raw) return {};
        try { return JSON.parse(raw); } catch { return {}; }
    };

    /* fetch current courier config ─────────────── */
    useEffect(() => {
        startLoading();
        SuperFetch.get("/client/courier/list", { headers })
            .then((response) => {
                const list = response.data?.data || [];
                list.forEach((item) => {
                    if (item.provider === "steadfast") { setSteadFastData(item); setOpenSteadFast(true); }
                    if (item.provider === "pathao")    { setPathaoData(item);    setOpenPathao(true); }
                    if (item.provider === "redx")      { setRedxData(item);      setOpenRedx(true); }
                    if (item.provider === "carrybee")  { setCarrybeeData(item);  setOpenCarrybee(true); }
                });
                stopLoading();
            })
            .catch(() => stopLoading());
    }, []);

    /* Steadfast submit ─────────────────────────── */
    const handleSteadfastSubmit = (data) => {
        startLoading();
        const config = { "Api-Key": data.sfApiKey, "Secret-Key": data.sfSecretKey };
        activateCourier(merchantId, "steadfast", "active", JSON.stringify(config))
            .then((res) => {
                stopLoading();
                if (res?.status === 200) {
                    showToast("Steadfast details have been successfully submitted.");
                    if (router.query.redirect_from) router.push("/?current_steap=panel6");
                }
            })
            .catch(() => stopLoading());
    };

    /* Pathao secrets helper ─────────────────────── */
    const handlePathaoSecretToggle = (key) => {
        setShowPathaoSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    /* ─────────────────────────────────────────────
       Render
    ───────────────────────────────────────────── */
    return (
        <>
            <section className="Courier">
                {isLoading && <SmallLoader />}

                <HeaderDescription
                    videoLink={{
                        video: "https://www.youtube.com/embed/PkGV4CPmCWo?si=Cqzjvs5kVd4Hkyjw",
                        title: "How to add your courier API with Funnel Liner : A detailed tutorial",
                    }}
                    headerIcon="flaticon-express-delivery"
                    title="Courier"
                    subTitle="Deliver your products with your preferred courier service"
                    search={false}
                    order={false}
                />

                {/* ── Page intro banner ── */}
                <div className="cb-hero">
                    <div className="cb-hero__icon">
                        <i className="flaticon-express-delivery" />
                    </div>
                    <div className="cb-hero__text">
                        <h2 className="cb-hero__title">Courier Integrations</h2>
                        <p className="cb-hero__sub">
                            Connect your preferred courier partner and start delivering with full API automation.
                        </p>
                    </div>
                    <div className="cb-hero__stat">
                        <span className="cb-stat-pill">
                            {[openSteadFast, openPathao, openRedx, openCarrybee].filter(Boolean).length} / 4 Connected
                        </span>
                    </div>
                </div>

                {/* ── Courier grid ── */}
                <div className="cb-grid">

                    {/* ── Steadfast ── */}
                    <CourierCard
                        logo="../images/steadfast.png"
                        logoAlt="Steadfast"
                        name="Steadfast Courier"
                        isActive={openSteadFast}
                        onToggle={setOpenSteadFast}
                    >
                        <form onSubmit={handleSubmit(handleSteadfastSubmit)} className="cb-form">
                            <div className="cb-field">
                                <label className="cb-label">API Key</label>
                                <div className="cb-input-wrap">
                                    <input
                                        {...register("sfApiKey", { required: true })}
                                        type={showSfApi ? "text" : "password"}
                                        defaultValue={decodeJson(steadFastData?.config)["Api-Key"] || ""}
                                        className="cb-input"
                                        placeholder="Enter API Key"
                                    />
                                    <EyeToggle visible={showSfApi} onToggle={() => setShowSfApi((v) => !v)} />
                                </div>
                                {errors.sfApiKey && <p className="cb-error">API Key is required</p>}
                            </div>

                            <div className="cb-field">
                                <label className="cb-label">Secret Key</label>
                                <div className="cb-input-wrap">
                                    <input
                                        {...register("sfSecretKey", { required: true })}
                                        type={showSfSecret ? "text" : "password"}
                                        defaultValue={decodeJson(steadFastData?.config)["Secret-Key"] || ""}
                                        className="cb-input"
                                        placeholder="Enter Secret Key"
                                    />
                                    <EyeToggle visible={showSfSecret} onToggle={() => setShowSfSecret((v) => !v)} />
                                </div>
                                {errors.sfSecretKey && <p className="cb-error">Secret Key is required</p>}
                            </div>

                            <button type="submit" className="cb-submit-btn">
                                <i className="flaticon-checked" /> Save Steadfast
                            </button>
                        </form>
                    </CourierCard>

                    {/* ── Pathao ── */}
                    <CourierCard
                        logo="images/pathao.png"
                        logoAlt="Pathao"
                        name="Pathao Parcels"
                        isActive={openPathao}
                        onToggle={setOpenPathao}
                    >
                        <Pathao
                            merchantId={merchantId}
                            stopLoading={stopLoading}
                            startLoading={startLoading}
                            showPathaoSicrets={showPathaoSecrets}
                            pathaoData={pathaoData}
                            hanldeInputTypeChange={handlePathaoSecretToggle}
                        />
                    </CourierCard>

                    {/* ── Redx ── */}
                    <RedxCourier
                        merchantId={merchantId}
                        showToast={showToast}
                        setOpenRedx={setOpenRedx}
                        openRedx={openRedx}
                        stopLoading={stopLoading}
                        startLoading={startLoading}
                        redxData={redxData}
                        useCard
                    />

                    {/* ── Carrybee ── */}
                    <CarrybeeCourier
                        merchantId={merchantId}
                        showToast={showToast}
                        setOpenCarrybee={setOpenCarrybee}
                        openCarrybee={openCarrybee}
                        stopLoading={stopLoading}
                        startLoading={startLoading}
                        carrybeeData={carrybeeData}
                    />

                </div>
            </section>
        </>
    );
};

export default Courier;
