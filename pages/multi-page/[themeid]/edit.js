import {
  Box,
  Button,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import withAuth from "../../../hook/PrivateRoute";
import { useToast } from "../../../hook/useToast";
import { shopId, userId, getSections, deleteSection, bulkSaveSections } from "../../api";

const BrandColorSection = ({
  groupedPanelStyle,
  register,
  brandColor,
  setValue,
  isSavingBrand,
  handleSaveBrandColor,
}) => (
  <Grid item xs={12}>
    <Box style={groupedPanelStyle}>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 600, marginBottom: 4 }}
      >
        Brand color
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Optional. Change only the brand color.
      </Typography>
      <Box
        style={{
          marginTop: 12,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <TextField
          {...register("brandColor")}
          type="color"
          size="small"
          style={{ width: 72, height: 44 }}
          inputProps={{
            style: { height: 44, cursor: "pointer", padding: 0 },
          }}
          onChange={e => setValue("brandColor", e.target.value)}
        />
        <TextField
          label="Hex color"
          size="small"
          fullWidth
          value={brandColor || ""}
          onChange={e => setValue("brandColor", e.target.value)}
          placeholder="#00a651"
        />
      </Box>
      <Box style={{ marginTop: 12 }}>
        <Button
          variant="contained"
          onClick={handleSaveBrandColor}
          disabled={isSavingBrand}
          style={{
            background: "#00a651",
            color: "#fff",
            fontWeight: 600,
            padding: "8px 16px",
            minHeight: 36,
          }}
        >
          {isSavingBrand ? "Updating..." : "Change brand color"}
        </Button>
      </Box>
    </Box>
  </Grid>
);

const BannerSlidesSection = ({
  groupedPanelStyle,
  slides,
  heroImageInputRefs,
  isSavingSlides,
  handleSlideFieldChange,
  handleSlideImageChange,
  handleRemoveSlideImage,
  handleRemoveSlide,
  handleAddSlide,
  handleSaveSlides,
}) => (
  <Grid item xs={12}>
    <Box style={groupedPanelStyle}>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 600, marginBottom: 4 }}
      >
        Banner slides
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Add up to 4 slides.
      </Typography>
      <Box
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 16,
              background: "#fff",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
                  Slide {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Slide title (optional)"
                  fullWidth
                  size="small"
                  value={slide.title}
                  onChange={e =>
                    handleSlideFieldChange(slide.id, "title", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Slide subtitle (optional)"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={slide.subtitle}
                  onChange={e =>
                    handleSlideFieldChange(slide.id, "subtitle", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image link (optional)"
                  fullWidth
                  size="small"
                  value={slide.imageLink}
                  onChange={e =>
                    handleSlideFieldChange(
                      slide.id,
                      "imageLink",
                      e.target.value
                    )
                  }
                  placeholder="https://"
                />
              </Grid>
              <Grid item xs={12}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  Slide image
                  <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "#888", marginLeft: 4 }}>
                    [Max size 5 MB]
                  </span>
                </label>
                <TextField
                  type="file"
                  fullWidth
                  size="small"
                  inputProps={{ accept: "image/*" }}
                  onChange={event => handleSlideImageChange(slide.id, event)}
                  inputRef={el => {
                    if (el) {
                      heroImageInputRefs.current[slide.id] = el;
                    }
                  }}
                />
                {(slide.image.previewURL || slide.image.uploadUrl) && (
                  <Box
                    style={{
                      marginTop: 8,
                      padding: 8,
                      background: "#f5f5f5",
                      borderRadius: 4,
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {slide.image.isUploading
                        ? "Uploading image..."
                        : slide.image.uploadUrl
                          ? "Image ready"
                          : "Image selected"}
                    </Typography>
                    <Box style={{ marginTop: 8 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveSlideImage(slide.id)}
                        style={{ minHeight: 32, padding: "6px 12px" }}
                      >
                        Remove image
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Button text (optional)"
                  fullWidth
                  size="small"
                  value={slide.buttonText}
                  onChange={e =>
                    handleSlideFieldChange(
                      slide.id,
                      "buttonText",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Button link (optional)"
                  fullWidth
                  size="small"
                  value={slide.buttonLink}
                  onChange={e =>
                    handleSlideFieldChange(
                      slide.id,
                      "buttonLink",
                      e.target.value
                    )
                  }
                  placeholder="https:// or #"
                />
              </Grid>
              <Grid item xs={12}>
                <Box style={{ display: "flex", gap: 8 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={slides.length === 1}
                    onClick={() => handleRemoveSlide(slide.id)}
                    size="small"
                    style={{ minHeight: 32, padding: "6px 12px" }}
                  >
                    Remove slide
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
      <Box style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Button
          variant="outlined"
          onClick={handleAddSlide}
          disabled={slides.length >= 4}
          size="small"
          style={{ minHeight: 32, padding: "6px 12px" }}
        >
          Add slide
        </Button>
      </Box>
      <Box style={{ marginTop: 12 }}>
        <Button
          variant="contained"
          onClick={handleSaveSlides}
          disabled={isSavingSlides}
          fullWidth
          style={{
            background: "#00a651",
            color: "#fff",
            padding: "8px 16px",
            fontWeight: 600,
            minHeight: 36,
          }}
        >
          {isSavingSlides ? "Saving..." : "Save banner slides"}
        </Button>
      </Box>
    </Box>
  </Grid>
);

const SECTION_TYPES = [
  { value: "featured", label: "Featured" },
  { value: "flash_sale", label: "Flash Sale" },
  { value: "social_media", label: "Social Media" },
  { value: "new_arrival", label: "New Arrival" },
  { value: "best_seller", label: "Best Seller" },
  { value: "winter", label: "Winter" },
  { value: "summer", label: "Summer" },
  { value: "custom", label: "Custom" },
];

const SectionsSection = ({
  groupedPanelStyle,
  sections,
  products,
  isProductsLoading,
  isSavingSections,
  isSectionsLoading,
  deletingSectionId,
  handleSectionFieldChange,
  handleSectionProductsChange,
  handleRemoveSection,
  handleAddSection,
  handleSaveSections,
}) => (
  <Grid item xs={12}>
    <Box style={groupedPanelStyle}>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 600, marginBottom: 4 }}
      >
        Sections
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Add section names and assign products from your list.
      </Typography>
      <Box
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {sections.map((section, index) => (
          <Box
            key={section.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 16,
              background: "#fff",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`Section name ${index + 1}`}
                  fullWidth
                  size="small"
                  value={section.title}
                  onChange={e =>
                    handleSectionFieldChange(section.id, "title", e.target.value)
                  }
                  placeholder="Featured / Eid sale / New Year sale"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Section type"
                  fullWidth
                  size="small"
                  value={section.sectionType || "featured"}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "sectionType",
                      e.target.value
                    )
                  }
                >
                  {SECTION_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description (optional)"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={section.description || ""}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="This is the flash sale product section"
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  label="Meta title (optional)"
                  fullWidth
                  size="small"
                  value={section.metaTitle || ""}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "metaTitle",
                      e.target.value
                    )
                  }
                  placeholder="Some meta title for ad campaign"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Meta description (optional)"
                  fullWidth
                  size="small"
                  value={section.metaDescription || ""}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "metaDescription",
                      e.target.value
                    )
                  }
                  placeholder="Some meta description for ad campaign"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Section URL (optional)"
                  fullWidth
                  size="small"
                  value={section.sectionUrl || ""}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "sectionUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Section image URL (optional)"
                  fullWidth
                  size="small"
                  value={section.sectionImageUrl || ""}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "sectionImageUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Section video URL (optional)"
                  fullWidth
                  size="small"
                  value={section.sectionVideoUrl || ""}
                  onChange={e =>
                    handleSectionFieldChange(
                      section.id,
                      "sectionVideoUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://"
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={section.isActive === 1}
                      onChange={e =>
                        handleSectionFieldChange(
                          section.id,
                          "isActive",
                          e.target.checked ? 1 : 0
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Publish section"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={section.hasCountdown === 1}
                      onChange={e =>
                        handleSectionFieldChange(
                          section.id,
                          "hasCountdown",
                          e.target.checked ? 1 : 0
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Enable countdown (Flash Sale)"
                />
              </Grid>
              {section.hasCountdown === 1 && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Countdown start"
                      type="datetime-local"
                      fullWidth
                      size="small"
                      value={section.countdownStart || ""}
                      onChange={e =>
                        handleSectionFieldChange(
                          section.id,
                          "countdownStart",
                          e.target.value
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Countdown end"
                      type="datetime-local"
                      fullWidth
                      size="small"
                      value={section.countdownEnd || ""}
                      onChange={e =>
                        handleSectionFieldChange(
                          section.id,
                          "countdownEnd",
                          e.target.value
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Select products"
                  fullWidth
                  size="small"
                  SelectProps={{
                    multiple: true,
                    value: section.productIds,
                    onChange: e =>
                      handleSectionProductsChange(section.id, e.target.value),
                    renderValue: selected =>
                      selected.length ? `${selected.length} selected` : "",
                  }}
                >
                  {isProductsLoading && (
                    <MenuItem disabled>Loading products...</MenuItem>
                  )}
                  {!isProductsLoading && products.length === 0 && (
                    <MenuItem disabled>No products found</MenuItem>
                  )}
                  {products.map(product => (
                    <MenuItem key={product.id} value={product.id}>
                      {product?.product_name || `#${product.id}`}
                    </MenuItem>
                  ))}
                </TextField>
                {section.productIds.length > 0 && (
                  <Box
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    {section.productIds.map(productId => {
                      const product = products.find(
                        item => item.id === productId
                      );
                      return (
                        <Chip
                          key={productId}
                          label={product?.product_name || productId}
                          size="small"
                          onDelete={() =>
                            handleSectionProductsChange(
                              section.id,
                              section.productIds.filter(id => id !== productId)
                            )
                          }
                        />
                      );
                    })}
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box style={{ display: "flex", gap: 8 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={deletingSectionId === section.id}
                    onClick={() => handleRemoveSection(section.id)}
                    size="small"
                    style={{ minHeight: 32, padding: "6px 12px" }}
                  >
                    {deletingSectionId === section.id
                      ? "Removing..."
                      : "Remove section"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
        {isSectionsLoading && (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
            Loading sections...
          </Typography>
        )}
      </Box>
      <Box style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Button
          variant="outlined"
          onClick={handleAddSection}
          size="small"
          style={{ minHeight: 32, padding: "6px 12px" }}
        >
          Add another section
        </Button>
      </Box>
      <Box style={{ marginTop: 12 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isSavingSections}
          onClick={handleSaveSections}
          style={{
            background: "#00a651",
            color: "#fff",
            padding: "8px 16px",
            fontWeight: 600,
            minHeight: 36,
          }}
        >
          {isSavingSections ? "Saving..." : "Save sections"}
        </Button>
      </Box>
    </Box>
  </Grid>
);

const RightFormPanel = ({
  groupedPanelStyle,
  register,
  brandColor,
  setValue,
  isSavingBrand,
  handleSaveBrandColor,
  slides,
  heroImageInputRefs,
  isSavingSlides,
  handleSlideFieldChange,
  handleSlideImageChange,
  handleRemoveSlideImage,
  handleRemoveSlide,
  handleAddSlide,
  handleSaveSlides,
  sections,
  products,
  isProductsLoading,
  isSavingSections,
  isSectionsLoading,
  deletingSectionId,
  handleSectionFieldChange,
  handleSectionProductsChange,
  handleRemoveSection,
  handleAddSection,
  handleSaveSections,
}) => (
  <Grid item xs={12} md={5} style={{ paddingLeft: 48, paddingRight: 16 }}>
    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
      Customize Theme Two
    </Typography>
    <Box
      style={{
        background: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: 10,
        padding: 24,
        boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "80vh",
          overflowY: "auto",
          paddingRight: 8,
        }}
        sx={{
          "& .MuiOutlinedInput-root:not(.MuiOutlinedInput-multiline)": {
            minHeight: 36,
          },
          "& .MuiInputBase-input": {
            padding: "8px 12px",
          },
          "& .MuiSelect-select": {
            padding: "8px 12px",
          },
          "& .MuiButton-root": {
            minHeight: 32,
            padding: "6px 12px",
          },
        }}
      >
        <Grid container spacing={2}>
          <BrandColorSection
            groupedPanelStyle={groupedPanelStyle}
            register={register}
            brandColor={brandColor}
            setValue={setValue}
            isSavingBrand={isSavingBrand}
            handleSaveBrandColor={handleSaveBrandColor}
          />
          <BannerSlidesSection
            groupedPanelStyle={groupedPanelStyle}
            slides={slides}
            heroImageInputRefs={heroImageInputRefs}
            isSavingSlides={isSavingSlides}
            handleSlideFieldChange={handleSlideFieldChange}
            handleSlideImageChange={handleSlideImageChange}
            handleRemoveSlideImage={handleRemoveSlideImage}
            handleRemoveSlide={handleRemoveSlide}
            handleAddSlide={handleAddSlide}
            handleSaveSlides={handleSaveSlides}
          />
          <SectionsSection
            groupedPanelStyle={groupedPanelStyle}
            sections={sections}
            products={products}
            isProductsLoading={isProductsLoading}
            isSavingSections={isSavingSections}
            isSectionsLoading={isSectionsLoading}
            deletingSectionId={deletingSectionId}
            handleSectionFieldChange={handleSectionFieldChange}
            handleSectionProductsChange={handleSectionProductsChange}
            handleRemoveSection={handleRemoveSection}
            handleAddSection={handleAddSection}
            handleSaveSections={handleSaveSections}
          />
        </Grid>
      </Box>
    </Box>
  </Grid>
);

const PreviewPane = ({
  brandColor,
  activeSlide,
  activeSlideImage,
  products,
  sections,
  sectionPreviewIndex,
  handleSectionPreviewPrev,
  handleSectionPreviewNext,
  previewSectionRefs,
  previewBannerRef,
  previewContainerRef,
  previewContentRef,
  previewScale,
}) => (
  <Grid item xs={12} md={7} style={{ paddingRight: 24 }}>
    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
      Preview (Theme Two)
    </Typography>
    <Box
      ref={previewContainerRef}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        width: "90%",
        margin: "0 auto",
        height: "80vh",
        overflowY: "auto",
        background: "#fff",
        boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.08)",
        padding: 12,
      }}
    >
      <Box
        style={{
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Box ref={previewContentRef}>
          {/* Navbar */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              borderBottom: "1px solid #fff",
              background: "#fff",
              position: "relative",
            }}
          >
            <Box style={{ display: "flex", gap: "24px", flex: 1 }}>
              <a
                href="#"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                MENS
              </a>
              <a
                href="#"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                KIDS
              </a>
              <a
                href="#"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                WOMENS
              </a>
            </Box>
            <Typography
              variant="h5"
              style={{
                fontWeight: 700,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                letterSpacing: 1,
              }}
            >
              BOMBAYLUX
            </Typography>
            <Box
              style={{
                display: "flex",
                gap: "12px",
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                🔍
              </Box>
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                🛒
              </Box>
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                👤
              </Box>
            </Box>
          </Box>

          {/* Hero Banner */}
          <Box
            ref={previewBannerRef}
            style={{
              width: "100%",
              minHeight: 400,
              background: activeSlideImage
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${activeSlideImage}) center/cover`
                : brandColor,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "60px 40px",
              position: "relative",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              style={{
                color: "#fff",
                fontWeight: 700,
                marginBottom: 16,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                fontSize: "2.5rem",
                lineHeight: 1.2,
              }}
            >
              {activeSlide?.title || "Fit that speaks before you do."}
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: "rgba(255,255,255,0.95)",
                marginBottom: 24,
                maxWidth: 500,
                fontSize: "1rem",
                lineHeight: 1.6,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {activeSlide?.subtitle ||
                "Should you focus on our fit and look or just your style? We'll make it easier, but not that easy for you."}
            </Typography>
            {activeSlide?.buttonText && (
              <Button
                variant="contained"
                href={activeSlide?.buttonLink || "#"}
                component="a"
                style={{
                  background: brandColor,
                  color: "#fff",
                  fontWeight: 600,
                  padding: "12px 32px",
                  borderRadius: 4,
                  textTransform: "none",
                }}
              >
                {activeSlide?.buttonText}
              </Button>
            )}
          </Box>

          {/* Promotional / Feature Section - 4 cards on white */}
          {/* <Box style={{ padding: "40px 24px", background: "#fff" }}>
            <Grid container spacing={2}>
              {[
                {
                  icon: "👔",
                  title: "BLUES",
                  desc: "Curated blues collection",
                },
                {
                  icon: "🎁",
                  title: "MEGA RAFFLE OFFERS",
                  desc: "Win big with every purchase",
                },
                {
                  icon: "✨",
                  title: "NEW ARRIVALS",
                  desc: "Fresh styles just landed",
                },
                {
                  icon: "🏷️",
                  title: "PRODUCE",
                  desc: "Best picks for you",
                },
              ].map((item, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Box
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: 20,
                      textAlign: "center",
                      border: "1px solid #eee",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h4"
                      style={{
                        marginBottom: 8,
                        fontSize: "2rem",
                        color: brandColor,
                      }}
                    >
                      {item.icon}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontWeight: 700,
                        marginBottom: 4,
                        color: "#000",
                        fontSize: "0.875rem",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: "#666", fontSize: "0.75rem" }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box> */}

          {/* Winter 25/26 Product Section - white background */}
          {/* <Box style={{ padding: "32px 24px", background: "#fff" }}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: 700, color: "#000" }}
              >
                Winter 25/26
              </Typography>
              <Box style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button
                  style={{
                    color: "#000",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  VIEW ALL
                </Button>
                <Button
                  style={{
                    background: "#f0f0f0",
                    color: "#000",
                    minWidth: 36,
                    height: 36,
                  }}
                >
                  ‹
                </Button>
                <Button
                  style={{
                    background: "#f0f0f0",
                    color: "#000",
                    minWidth: 36,
                    height: 36,
                  }}
                >
                  ›
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map(item => (
                <Grid item xs={6} sm={3} key={item}>
                  <Box
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <Box
                      style={{
                        width: "100%",
                        paddingTop: "120%",
                        background: "#f5f5f5",
                        position: "relative",
                      }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          background: brandColor,
                          color: "#fff",
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        New
                      </Box>
                    </Box>
                    <Box style={{ padding: 12 }}>
                      <Typography
                        variant="body2"
                        style={{ fontWeight: 600, marginBottom: 4 }}
                      >
                        Product Name
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: "#666", marginBottom: 8 }}
                      >
                        ৳1,299
                      </Typography>
                      <Button
                        size="small"
                        style={{
                          color: brandColor,
                          textTransform: "none",
                          fontWeight: 600,
                          padding: 0,
                        }}
                      >
                        ADD TO CART
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box> */}

          {/* Categories Section - 2x2 grid, white background */}
          <Box style={{ padding: "32px 24px", background: "#fff" }}>
            <Typography
              variant="h5"
              style={{ fontWeight: 700, marginBottom: 20, color: "#000" }}
            >
              Categories
            </Typography>
            <Grid container spacing={2}>
              {["SHIRTS", "KURTA", "BURQAS", "SAREE"].map((cat, idx) => (
                <Grid item xs={6} key={idx}>
                  <Box
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                      position: "relative",
                      paddingTop: "75%",
                      background: "#e8e8e8",
                    }}
                  >
                    <Box
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 16,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.5))",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          marginBottom: 8,
                        }}
                      >
                        {cat}
                      </Typography>
                      <Button
                        size="small"
                        style={{
                          background: "#fff",
                          color: "#000",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        View All
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Sections */}
          {sections.map(section => {
            const sectionProducts = products.filter(product =>
              section.productIds.includes(product.id)
            );
            const showFallback = sectionProducts.length === 0;
            const previewItems = showFallback
              ? [1, 2, 3, 4, 5, 6, 7, 8]
              : sectionProducts;
            const totalItems = previewItems.length;
            const startIndex =
              totalItems > 8 ? sectionPreviewIndex[section.id] || 0 : 0;
            const visibleItems =
              totalItems > 8
                ? previewItems
                    .concat(previewItems)
                    .slice(startIndex, startIndex + 8)
                : previewItems;

            return (
              <Box
                key={section.id}
                ref={el => {
                  if (el) {
                    previewSectionRefs.current[section.id] = el;
                  }
                }}
                style={{ padding: "32px 24px", background: "#fff" }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{ fontWeight: 700, color: "#000" }}
                  >
                    {section.title || "Section"}
                  </Typography>
                  <Box
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <Button
                      style={{
                        color: "#000",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      VIEW ALL
                    </Button>
                    <Button
                      style={{
                        background: "#f0f0f0",
                        color: "#000",
                        minWidth: 36,
                        height: 36,
                      }}
                      onClick={() =>
                        handleSectionPreviewPrev(section.id, totalItems)
                      }
                      disabled={totalItems <= 8}
                    >
                      ‹
                    </Button>
                    <Button
                      style={{
                        background: "#f0f0f0",
                        color: "#000",
                        minWidth: 36,
                        height: 36,
                      }}
                      onClick={() =>
                        handleSectionPreviewNext(section.id, totalItems)
                      }
                      disabled={totalItems <= 8}
                    >
                      ›
                    </Button>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  {showFallback
                    ? visibleItems.map(item => (
                        <Grid item xs={6} sm={3} key={item}>
                          <Box
                            style={{
                              background: "#fff",
                              borderRadius: 8,
                              overflow: "hidden",
                              border: "1px solid #eee",
                            }}
                          >
                            <Box
                              style={{
                                width: "100%",
                                paddingTop: "120%",
                                background: "#f5f5f5",
                                position: "relative",
                              }}
                            >
                              <Box
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  background: brandColor,
                                  color: "#fff",
                                  padding: "4px 10px",
                                  borderRadius: 4,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                New
                              </Box>
                            </Box>
                            <Box style={{ padding: 12 }}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: 600, marginBottom: 4 }}
                              >
                                Product {item}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ color: "#666", marginBottom: 8 }}
                              >
                                ৳999
                              </Typography>
                              <Button
                                size="small"
                                style={{
                                  color: brandColor,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  padding: 0,
                                }}
                              >
                                ADD TO CART
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      ))
                    : visibleItems.map(product => (
                        <Grid item xs={6} sm={3} key={product.id}>
                          <Box
                            style={{
                              background: "#fff",
                              borderRadius: 8,
                              overflow: "hidden",
                              border: "1px solid #eee",
                            }}
                          >
                            <Box
                              style={{
                                width: "100%",
                                paddingTop: "120%",
                                background: "#f5f5f5",
                                position: "relative",
                                backgroundImage: product?.main_image
                                  ? `url(${product.main_image})`
                                  : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              <Box
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  background: brandColor,
                                  color: "#fff",
                                  padding: "4px 10px",
                                  borderRadius: 4,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                New
                              </Box>
                            </Box>
                            <Box style={{ padding: 12 }}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: 600, marginBottom: 4 }}
                              >
                                {product?.product_name || "Product"}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ color: "#666", marginBottom: 8 }}
                              >
                                ৳{product?.price ?? "--"}
                              </Typography>
                              <Button
                                size="small"
                                style={{
                                  color: brandColor,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  padding: 0,
                                }}
                              >
                                ADD TO CART
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                </Grid>
              </Box>
            );
          })}

          {/* Secondary CTA Banner - same hero text & button */}
          <Box
            style={{
              padding: "60px 24px",
              background: `linear-gradient(90deg, #ffd6e0 0%, #e8d4ff 25%, #ffe0c4 50%, #c8e6c9 100%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              style={{ fontWeight: 700, color: "#333", marginBottom: 12 }}
            >
              {activeSlide?.title || "Fit that the speaks before you do."}
            </Typography>
            <Typography
              variant="body1"
              style={{ color: "#555", marginBottom: 24, maxWidth: 500 }}
            >
              {activeSlide?.subtitle ||
                "Should you focus on our fit and look or just your style? We'll make it easier, but not that easy for you."}
            </Typography>
            {activeSlide?.buttonText && (
              <Button
                variant="contained"
                style={{
                  background: brandColor,
                  color: "#fff",
                  fontWeight: 600,
                  padding: "12px 32px",
                  borderRadius: 4,
                  textTransform: "none",
                }}
              >
                {activeSlide?.buttonText}
              </Button>
            )}
          </Box>

          {/* Footer - white/light background */}
          <Box
            style={{
              padding: "40px 24px",
              background: "#fff",
              borderTop: "1px solid #eee",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 700, marginBottom: 8 }}
                >
                  SHOPPY BOMBAY
                </Typography>
                <Box style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    f
                  </Box>
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    𝕏
                  </Box>
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    📷
                  </Box>
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    P
                  </Box>
                </Box>
                <Typography variant="caption" style={{ color: "#666" }}>
                  © 2025 Shoppy Bombay. All rights reserved.
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#000",
                  }}
                >
                  INFORMATION
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {["About Us", "Delivery", "Privacy", "Terms"].map(link => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        color: "#666",
                        textDecoration: "none",
                        fontSize: 14,
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#000",
                  }}
                >
                  CATEGORIES
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {["Mens", "Womens", "Kids"].map(link => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        color: "#666",
                        textDecoration: "none",
                        fontSize: 14,
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#000",
                  }}
                >
                  SUPPORT
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {["Contact", "FAQ"].map(link => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        color: "#666",
                        textDecoration: "none",
                        fontSize: 14,
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#000",
                  }}
                >
                  HELP
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {["Help Center", "Returns"].map(link => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        color: "#666",
                        textDecoration: "none",
                        fontSize: 14,
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    background: brandColor,
                    color: "#fff",
                    textTransform: "none",
                    padding: "10px 20px",
                    borderRadius: 4,
                  }}
                >
                  📱 Download app
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  </Grid>
);

const MultiPageThemeEdit = () => {
  const router = useRouter();
  const { themeid } = router.query;
  const { register, watch, setValue } = useForm({
    defaultValues: {
      brandColor: "#894bca",
    },
  });

  const showToast = useToast();
  const showToastRef = useRef(showToast);
  const heroImageInputRefs = useRef({});
  const previewSectionRefs = useRef({});
  const previewBannerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const previewContentRef = useRef(null);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isSavingSlides, setIsSavingSlides] = useState(false);
  const [isSavingSections, setIsSavingSections] = useState(false);
  const [isSectionsLoading, setIsSectionsLoading] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Featured",
      description: "",
      metaTitle: "",
      metaDescription: "",
      productIds: [],
      sectionType: "featured",
      sectionUrl: "",
      sectionImageUrl: "",
      sectionVideoUrl: "",
      isActive: 1,
      hasCountdown: 0,
      countdownStart: "",
      countdownEnd: "",
    },
  ]);
  const [sectionPreviewIndex, setSectionPreviewIndex] = useState({});
  const createEmptySlide = () => ({
    id: Date.now() + Math.random(),
    title: "",
    subtitle: "",
    imageLink: "",
    buttonText: "",
    buttonLink: "",
    image: {
      file: null,
      previewURL: "",
      uploadUrl: "",
      isUploading: false,
    },
  });
  const [slides, setSlides] = useState([createEmptySlide()]);

  const brandColor = watch("brandColor");
  const activeSlide = slides[0];
  const activeSlideImage =
    activeSlide?.image?.previewURL || activeSlide?.image?.uploadUrl || "";
  const groupedPanelStyle = {
    border: "1px solid #cfcfcf",
    borderRadius: 10,
    padding: 16,
    background: "#eef1f4",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  };
  const [previewScale, setPreviewScale] = useState(1);

  useLayoutEffect(() => {
    const container = previewContainerRef.current;
    const content = previewContentRef.current;
    if (!container || !content) return;
    const containerHeight = container.clientHeight;
    const containerWidth = container.clientWidth;
    const contentHeight = content.scrollHeight;
    const contentWidth = content.scrollWidth;
    if (!contentHeight || !contentWidth) return;
    const heightScale = containerHeight / contentHeight;
    const widthScale = containerWidth / contentWidth;
    const nextScale = Math.min(0.95, heightScale, widthScale);
    setPreviewScale(nextScale);
  }, [sections, slides]);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const themeSettingsId = themeid || 19;
      setIsSettingsLoading(true);
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.BASE_URL}/client/theme/settings/${themeSettingsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "shop-id": shopId,
              id: userId,
            },
          }
        );

        let settings = response?.data?.data ?? response?.data ?? null;
        if (Array.isArray(settings)) {
          settings = settings[0] || null;
        }
        if (settings?.data && !settings?.banner_slides) {
          settings = settings.data;
        }
        const fallbackBrandColor = "#894bca";

        setValue(
          "brandColor",
          settings?.brand_color || fallbackBrandColor,
          { shouldDirty: false }
        );

        let bannerSlidesRaw =
          settings?.banner_slides ||
          settings?.theme_settings?.banner_slides ||
          settings?.data?.banner_slides ||
          [];
        if (typeof bannerSlidesRaw === "string") {
          try {
            bannerSlidesRaw = JSON.parse(bannerSlidesRaw);
          } catch (error) {
            bannerSlidesRaw = [];
          }
        }
        if (
          bannerSlidesRaw &&
          !Array.isArray(bannerSlidesRaw) &&
          typeof bannerSlidesRaw === "object"
        ) {
          bannerSlidesRaw = Object.values(bannerSlidesRaw);
        }
        const bannerSlides = Array.isArray(bannerSlidesRaw)
          ? bannerSlidesRaw
          : [];
        if (bannerSlides.length > 0) {
          setSlides(
            bannerSlides.map(item => ({
              id: Date.now() + Math.random(),
              title: item?.image_title || "",
              subtitle: item?.image_subtitle || item?.image_text || "",
              imageLink: item?.image_link || item?.link || "",
              buttonText: item?.button_text || "",
              buttonLink: item?.button_link || "",
              image: {
                file: null,
                previewURL: "",
                uploadUrl: item?.image || item?.image_url || item?.image_link || "",
                isUploading: false,
              },
            }))
          );
        } else {
          setSlides([createEmptySlide()]);
        }

        // Sections are now loaded from GET /client/sections API (fetchSections)
      } catch (error) {
        showToastRef.current(
          error?.response?.data?.msg
            ? error?.response?.data?.msg
            : "Failed to load theme settings",
          "error"
        );
      } finally {
        setIsSettingsLoading(false);
      }
    };

    fetchThemeSettings();
  }, [themeid, setValue]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        setIsProductsLoading(true);
        const response = await axios.get(
          API_ENDPOINTS.BASE_URL + "/client/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "shop-id": shopId,
              id: userId,
            },
            params: { page: 1, perPage: 200 },
          }
        );
        const productList =
          response?.data?.data?.data ?? response?.data?.data ?? [];
        setProducts(productList);
      } catch (error) {
        setProducts([]);
        showToastRef.current("Failed to load products", "error");
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setIsSectionsLoading(true);
        const response = await getSections();
        const sectionList =
          response?.data?.data ?? response?.data ?? [];
        if (Array.isArray(sectionList) && sectionList.length > 0) {
          setSections(
            sectionList.map(section => ({
              id: section.id,
              title: section.name || "",
              description: section.description || "",
              metaTitle: section.meta_title || "",
              metaDescription: section.meta_description || "",
              productIds: Array.isArray(section.products)
                ? section.products.map(p => (typeof p === "object" ? p.id : p))
                : [],
              sectionType: section.section_type || "featured",
              sectionUrl: section.section_url || "",
              sectionImageUrl: section.section_image_url || "",
              sectionVideoUrl: section.section_video_url || "",
              isActive: Number(section.is_active ?? 1),
              hasCountdown: Number(section.has_countdown ?? 0),
              countdownStart: section.countdown_start || "",
              countdownEnd: section.countdown_end || "",
            }))
          );
        }
      } catch (error) {
        showToastRef.current("Failed to load sections", "error");
      } finally {
        setIsSectionsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleSlideFieldChange = (id, field, value) => {
    setSlides(prev =>
      prev.map(slide =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
    requestAnimationFrame(() => {
      if (previewBannerRef.current) {
        previewBannerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const handleSlideImageChange = (id, event) => {
    const file = event.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      showToast("Image size is too big! Maximum 5 MB allowed.", "error");
      event.target.value = "";
      return;
    }
    setSlides(prev =>
      prev.map(slide => {
        if (slide.id !== id) return slide;
        if (!file) {
          return {
            ...slide,
            image: {
              file: null,
              previewURL: "",
              uploadUrl: "",
              isUploading: false,
            },
          };
        }

        if (slide.image.previewURL) {
          URL.revokeObjectURL(slide.image.previewURL);
        }

        const previewURL = URL.createObjectURL(file);
        return {
          ...slide,
          image: {
            file,
            previewURL,
            uploadUrl: "",
            isUploading: false,
          },
        };
      })
    );
    requestAnimationFrame(() => {
      if (previewBannerRef.current) {
        previewBannerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const handleRemoveSlideImage = id => {
    setSlides(prev =>
      prev.map(slide => {
        if (slide.id !== id) return slide;
        if (slide.image.previewURL) {
          URL.revokeObjectURL(slide.image.previewURL);
        }
        return {
          ...slide,
          image: {
            file: null,
            previewURL: "",
            uploadUrl: "",
            isUploading: false,
          },
        };
      })
    );
    if (heroImageInputRefs.current[id]) {
      heroImageInputRefs.current[id].value = "";
    }
  };

  const handleAddSlide = () => {
    setSlides(prev => {
      if (prev.length >= 4) return prev;
      return [...prev, createEmptySlide()];
    });
    requestAnimationFrame(() => {
      if (previewBannerRef.current) {
        previewBannerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const handleRemoveSlide = id => {
    setSlides(prev => {
      if (prev.length === 1) return prev;
      const nextSlides = prev.filter(slide => slide.id !== id);
      return nextSlides.length ? nextSlides : [createEmptySlide()];
    });
    requestAnimationFrame(() => {
      if (previewBannerRef.current) {
        previewBannerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const getUploadUrlFromResponse = response => {
    const responseData = response?.data?.data ?? response?.data ?? null;
    return (
      (typeof responseData === "string" ? responseData : "") ||
      responseData?.image_url ||
      responseData?.url ||
      responseData?.image ||
      responseData?.[0]?.image_url ||
      responseData?.[0]?.url ||
      responseData?.[0]?.image ||
      response?.data?.image_url ||
      response?.data?.url ||
      response?.data?.image ||
      ""
    );
  };

  const buildBannerSlidesPayload = sourceSlides =>
    sourceSlides.map(slide => ({
      image: slide.image.uploadUrl || "",
      image_link: slide.imageLink,
      button_link: slide.buttonLink,
      button_text: slide.buttonText,
      image_title: slide.title,
      image_subtitle: slide.subtitle,
      image_text: slide.subtitle,
    }));

  const buildSectionsPayload = sourceSections =>
    sourceSections.map(section => ({
      name: section.title,
      description: section.description || "",
      meta_title: section.metaTitle || "",
      meta_description: section.metaDescription || "",
      products: section.productIds,
      section_type: section.sectionType || "featured",
      section_url: section.sectionUrl || "",
      section_image_url: section.sectionImageUrl || "",
      section_video_url: section.sectionVideoUrl || "",
      is_active: section.isActive ?? 1,
      has_countdown: section.hasCountdown ?? 0,
      countdown_start: section.countdownStart || "",
      countdown_end: section.countdownEnd || "",
    }));

  const postThemeSettings = async (token, payloadOverrides = {}) => {
    const themeIdNumber = Number(themeid);
    const basePayload = {
      brand_color: brandColor,
      banner_slides: buildBannerSlidesPayload(slides),
      extra_settings: buildSectionsPayload(sections),
    };
    return axios.post(
      `${API_ENDPOINTS.BASE_URL}/client/theme/web-theme-settings`,
      {
        theme_id: Number.isNaN(themeIdNumber) ? themeid : themeIdNumber,
        ...basePayload,
        ...payloadOverrides,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "shop-id": shopId,
          id: userId,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const uploadSlideImage = async (token, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      `${API_ENDPOINTS.BASE_URL}/client/theme/web-theme-banner-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "shop-id": shopId,
          id: userId,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return getUploadUrlFromResponse(response);
  };

  const handleSaveBrandColor = async () => {
    if (!themeid) {
      showToast("Theme id not found", "error");
      return;
    }
    if (!brandColor) {
      showToast("Select a brand color to update", "error");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      showToast("Authentication required", "error");
      return;
    }

    setIsSavingBrand(true);
    try {
      await postThemeSettings(token, { brand_color: brandColor });
      showToast("Brand color updated", "success");
    } catch (error) {
      showToast(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : "Failed to update brand color",
        "error"
      );
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleSaveSlides = async () => {
    if (!themeid) {
      showToast("Theme id not found", "error");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      showToast("Authentication required", "error");
      return;
    }

    for (const slide of slides) {
      if (!slide.image.file && !slide.image.uploadUrl) {
        showToast("Please select an image for each slide", "error");
        return;
      }
    }

    setIsSavingSlides(true);
    try {
      const uploadedSlides = [];

      for (const slide of slides) {
        if (slide.image.file) {
          setSlides(prev =>
            prev.map(item =>
              item.id === slide.id
                ? {
                    ...item,
                    image: { ...item.image, isUploading: true },
                  }
                : item
            )
          );
          const uploadedImageUrl = await uploadSlideImage(
            token,
            slide.image.file
          );

          if (!uploadedImageUrl) {
            showToast("Image upload response missing URL", "error");
            setSlides(prev =>
              prev.map(item =>
                item.id === slide.id
                  ? {
                      ...item,
                      image: { ...item.image, isUploading: false },
                    }
                  : item
              )
            );
            setIsSavingSlides(false);
            return;
          }

          uploadedSlides.push({
            ...slide,
            image: {
              ...slide.image,
              uploadUrl: uploadedImageUrl,
              isUploading: false,
            },
          });
        } else {
          uploadedSlides.push(slide);
        }
      }

      setSlides(prev =>
        prev.map(slide => {
          const updated = uploadedSlides.find(item => item.id === slide.id);
          return updated ? updated : slide;
        })
      );

      await postThemeSettings(token, {
        banner_slides: uploadedSlides.map(slide => ({
          image: slide.image.uploadUrl || "",
          image_link: slide.imageLink,
          button_link: slide.buttonLink,
          button_text: slide.buttonText,
          image_title: slide.title,
          image_subtitle: slide.subtitle,
          image_text: slide.subtitle,
        })),
      });
      showToast("Banner slides updated", "success");
    } catch (error) {
      setSlides(prev =>
        prev.map(slide => ({
          ...slide,
          image: { ...slide.image, isUploading: false },
        }))
      );
      showToast(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : "Failed to update banner slides",
        "error"
      );
    } finally {
      setIsSavingSlides(false);
    }
  };

  const handleSaveSections = async () => {
    const token = Cookies.get("token");
    if (!token) {
      showToast("Authentication required", "error");
      return;
    }

    setIsSavingSections(true);
    try {
      // Convert datetime-local format (YYYY-MM-DDTHH:mm) to API format (YYYY-MM-DD HH:mm:ss)
      const formatDateTime = value => {
        if (!value) return "";
        return value.replace("T", " ") + (value.length === 16 ? ":00" : "");
      };

      const payload = sections.map(section => {
        const sectionData = {
          name: section.title,
          description: section.description || "",
          meta_title: section.metaTitle || "",
          meta_description: section.metaDescription || "",
          section_type: section.sectionType || "featured",
          section_url: section.sectionUrl || "",
          section_image_url: section.sectionImageUrl || "",
          section_video_url: section.sectionVideoUrl || "",
          is_active: Number(section.isActive ?? 1),
          has_countdown: Number(section.hasCountdown ?? 0),
          countdown_start: formatDateTime(section.countdownStart),
          countdown_end: formatDateTime(section.countdownEnd),
          products: section.productIds || [],
        };
        // Include id only for existing sections (not locally added ones)
        if (!section.isLocal) {
          sectionData.id = Number(section.id);
        }
        return sectionData;
      });

      const response = await bulkSaveSections(payload);

      if (response?.response?.status >= 400 || response instanceof Error) {
        showToast(
          response?.response?.data?.msg || "Failed to save sections",
          "error"
        );
      } else {
        showToast("Sections saved successfully", "success");
        // Re-fetch sections to get updated ids from backend
        const fetchRes = await getSections();
        const sectionList =
          fetchRes?.data?.data ?? fetchRes?.data ?? [];
        if (Array.isArray(sectionList) && sectionList.length > 0) {
          setSections(
            sectionList.map(s => ({
              id: s.id,
              title: s.name || "",
              description: s.description || "",
              metaTitle: s.meta_title || "",
              metaDescription: s.meta_description || "",
              productIds: Array.isArray(s.products)
                ? s.products.map(p => (typeof p === "object" ? p.id : p))
                : [],
              sectionType: s.section_type || "featured",
              sectionUrl: s.section_url || "",
              sectionImageUrl: s.section_image_url || "",
              sectionVideoUrl: s.section_video_url || "",
              isActive: Number(s.is_active ?? 1),
              hasCountdown: Number(s.has_countdown ?? 0),
              countdownStart: s.countdown_start || "",
              countdownEnd: s.countdown_end || "",
            }))
          );
        }
      }
    } catch (error) {
      showToast(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : "Failed to save sections",
        "error"
      );
    } finally {
      setIsSavingSections(false);
    }
  };

  const handleAddSection = () => {
    const newId = Date.now();
    setSections(prev => [
      ...prev,
      {
        id: newId,
        title: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        productIds: [],
        sectionType: "featured",
        sectionUrl: "",
        sectionImageUrl: "",
        sectionVideoUrl: "",
        isActive: 1,
        hasCountdown: 0,
        countdownStart: "",
        countdownEnd: "",
        isLocal: true,
      },
    ]);
    requestAnimationFrame(() => {
      const target = previewSectionRefs.current[newId];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  const handleRemoveSection = async id => {
    const section = sections.find(s => s.id === id);

    // If section was added locally and never saved to backend, just remove from state
    if (section?.isLocal) {
      setSections(prev => prev.filter(s => s.id !== id));
      return;
    }

    setDeletingSectionId(id);
    try {
      const response = await deleteSection(id);
      if (response?.response?.status >= 400 || response instanceof Error) {
        showToast(
          response?.response?.data?.msg || "Failed to delete section",
          "error"
        );
        return;
      }
      setSections(prev => prev.filter(section => section.id !== id));
      showToast("Section removed successfully", "success");
    } catch (error) {
      showToast(
        error?.response?.data?.msg || "Failed to delete section",
        "error"
      );
    } finally {
      setDeletingSectionId(null);
    }
  };

  const handleSectionFieldChange = (id, field, value) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
    requestAnimationFrame(() => {
      const target = previewSectionRefs.current[id];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  const handleSectionTitleChange = (id, value) => {
    handleSectionFieldChange(id, "title", value);
  };

  const handleSectionProductsChange = (id, productIds) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, productIds } : section
      )
    );
    requestAnimationFrame(() => {
      const target = previewSectionRefs.current[id];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  const handleSectionPreviewPrev = (id, total) => {
    if (!total) return;
    setSectionPreviewIndex(prev => {
      const current = prev[id] || 0;
      const next = (current - 1 + total) % total;
      return { ...prev, [id]: next };
    });
  };

  const handleSectionPreviewNext = (id, total) => {
    if (!total) return;
    setSectionPreviewIndex(prev => {
      const current = prev[id] || 0;
      const next = (current + 1) % total;
      return { ...prev, [id]: next };
    });
  };

  return (
    <>
      <Box style={{ minHeight: "100vh", background: "#fff" }}>
        <Container maxWidth="xl" style={{ padding: "40px 0 24px" }}>
          <Grid container spacing={3}>
            <PreviewPane
              brandColor={brandColor}
              activeSlide={activeSlide}
              activeSlideImage={activeSlideImage}
              products={products}
              sections={sections}
              sectionPreviewIndex={sectionPreviewIndex}
              handleSectionPreviewPrev={handleSectionPreviewPrev}
              handleSectionPreviewNext={handleSectionPreviewNext}
              previewSectionRefs={previewSectionRefs}
              previewBannerRef={previewBannerRef}
              previewContainerRef={previewContainerRef}
              previewContentRef={previewContentRef}
              previewScale={previewScale}
            />
            <RightFormPanel
              groupedPanelStyle={groupedPanelStyle}
              register={register}
              brandColor={brandColor}
              setValue={setValue}
              isSavingBrand={isSavingBrand}
              handleSaveBrandColor={handleSaveBrandColor}
              slides={slides}
              heroImageInputRefs={heroImageInputRefs}
              isSavingSlides={isSavingSlides}
              handleSlideFieldChange={handleSlideFieldChange}
              handleSlideImageChange={handleSlideImageChange}
              handleRemoveSlideImage={handleRemoveSlideImage}
              handleRemoveSlide={handleRemoveSlide}
              handleAddSlide={handleAddSlide}
              handleSaveSlides={handleSaveSlides}
              sections={sections}
              products={products}
              isProductsLoading={isProductsLoading}
              isSavingSections={isSavingSections}
              isSectionsLoading={isSectionsLoading}
              deletingSectionId={deletingSectionId}
              handleSectionFieldChange={handleSectionFieldChange}
              handleSectionProductsChange={handleSectionProductsChange}
              handleRemoveSection={handleRemoveSection}
              handleAddSection={handleAddSection}
              handleSaveSections={handleSaveSections}
            />
          </Grid>
        </Container>
      </Box>
      {false && (
        <Box style={{ minHeight: "100vh" }}>
          <Container maxWidth="xl" style={{ padding: "24px 0" }}>
            <Grid container spacing={3}>
              {/* Left: Theme Two Preview */}
              <Grid item xs={12} md={7} style={{ paddingRight: 24 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Preview (Theme Two)
                </Typography>
                <Box
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    width: "90%",
                    margin: "0 auto",
                    height: "80vh",
                    overflowY: "auto",
                    background: "#fafafa",
                    boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.08)",
                    padding: 12,
                  }}
                >
                  <Box
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      ref={previewContentRef}
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: "top center",
                      }}
                    >
                      {/* Navbar */}
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 24px",
                          borderBottom: "1px solid #eee",
                          background: "#fff",
                          position: "relative",
                        }}
                      >
                        <Box style={{ display: "flex", gap: "24px", flex: 1 }}>
                          <a
                            href="#"
                            style={{
                              color: "#000",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            MENS
                          </a>
                          <a
                            href="#"
                            style={{
                              color: "#000",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            KIDS
                          </a>
                          <a
                            href="#"
                            style={{
                              color: "#000",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            WOMENS
                          </a>
                        </Box>
                        <Typography
                          variant="h5"
                          style={{
                            fontWeight: 700,
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            letterSpacing: 1,
                          }}
                        >
                          BOMBAYLUX
                        </Typography>
                        <Box
                          style={{
                            display: "flex",
                            gap: "12px",
                            flex: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Box
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 4,
                              background: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            🔍
                          </Box>
                          <Box
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 4,
                              background: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            🛒
                          </Box>
                          <Box
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 4,
                              background: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            👤
                          </Box>
                        </Box>
                      </Box>

                      {/* Hero Banner */}
                      <Box
                        ref={previewBannerRef}
                        style={{
                          width: "100%",
                          minHeight: 400,
                          background: activeSlideImage
                            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${activeSlideImage}) center/cover`
                            : `linear-gradient(135deg, ${brandColor}dd, ${brandColor}aa)`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          padding: "60px 40px",
                          position: "relative",
                        }}
                      >
                        <Typography
                          variant="h3"
                          component="h1"
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            marginBottom: 16,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                            fontSize: "2.5rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {activeSlide?.title ||
                            "Fit that speaks before you do."}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{
                            color: "rgba(255,255,255,0.95)",
                            marginBottom: 24,
                            maxWidth: 500,
                            fontSize: "1rem",
                            lineHeight: 1.6,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          {activeSlide?.subtitle ||
                            "Should you focus on our fit and look or just your style? We'll make it easier, but not that easy for you."}
                        </Typography>
                        {activeSlide?.buttonText && (
                          <Button
                            variant="contained"
                            href={activeSlide?.buttonLink || "#"}
                            component="a"
                            style={{
                              background: brandColor,
                              color: "#fff",
                              fontWeight: 600,
                              padding: "12px 32px",
                              borderRadius: 4,
                              textTransform: "none",
                            }}
                          >
                            {activeSlide?.buttonText}
                          </Button>
                        )}
                      </Box>

                      {/* Promotional / Feature Section - 4 cards on white */}
                      <Box style={{ padding: "40px 24px", background: "#fff" }}>
                        <Grid container spacing={2}>
                          {[
                            {
                              icon: "👔",
                              title: "BLUES",
                              desc: "Curated blues collection",
                            },
                            {
                              icon: "🎁",
                              title: "MEGA RAFFLE OFFERS",
                              desc: "Win big with every purchase",
                            },
                            {
                              icon: "✨",
                              title: "NEW ARRIVALS",
                              desc: "Fresh styles just landed",
                            },
                            {
                              icon: "🏷️",
                              title: "PRODUCE",
                              desc: "Best picks for you",
                            },
                          ].map((item, idx) => (
                            <Grid item xs={6} md={3} key={idx}>
                              <Box
                                style={{
                                  background: "#fff",
                                  borderRadius: 8,
                                  padding: 20,
                                  textAlign: "center",
                                  border: "1px solid #eee",
                                  height: "100%",
                                }}
                              >
                                <Typography
                                  variant="h4"
                                  style={{
                                    marginBottom: 8,
                                    fontSize: "2rem",
                                    color: brandColor,
                                  }}
                                >
                                  {item.icon}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  style={{
                                    fontWeight: 700,
                                    marginBottom: 4,
                                    color: "#000",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  style={{ color: "#666", fontSize: "0.75rem" }}
                                >
                                  {item.desc}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Winter 25/26 Product Section - white background */}
                      <Box style={{ padding: "32px 24px", background: "#fff" }}>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                          }}
                        >
                          <Typography
                            variant="h5"
                            style={{ fontWeight: 700, color: "#000" }}
                          >
                            Winter 25/26
                          </Typography>
                          <Box
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Button
                              style={{
                                color: "#000",
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              VIEW ALL
                            </Button>
                            <Button
                              style={{
                                background: "#f0f0f0",
                                color: "#000",
                                minWidth: 36,
                                height: 36,
                              }}
                            >
                              ‹
                            </Button>
                            <Button
                              style={{
                                background: "#f0f0f0",
                                color: "#000",
                                minWidth: 36,
                                height: 36,
                              }}
                            >
                              ›
                            </Button>
                          </Box>
                        </Box>
                        <Grid container spacing={2}>
                          {[1, 2, 3, 4].map(item => (
                            <Grid item xs={6} sm={3} key={item}>
                              <Box
                                style={{
                                  background: "#fff",
                                  borderRadius: 8,
                                  overflow: "hidden",
                                  border: "1px solid #eee",
                                }}
                              >
                                <Box
                                  style={{
                                    width: "100%",
                                    paddingTop: "120%",
                                    background: "#f5f5f5",
                                    position: "relative",
                                  }}
                                >
                                  <Box
                                    style={{
                                      position: "absolute",
                                      top: 8,
                                      left: 8,
                                      background: brandColor,
                                      color: "#fff",
                                      padding: "4px 10px",
                                      borderRadius: 4,
                                      fontSize: "0.7rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    New
                                  </Box>
                                </Box>
                                <Box style={{ padding: 12 }}>
                                  <Typography
                                    variant="body2"
                                    style={{ fontWeight: 600, marginBottom: 4 }}
                                  >
                                    Product Name
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{ color: "#666", marginBottom: 8 }}
                                  >
                                    ৳1,299
                                  </Typography>
                                  <Button
                                    size="small"
                                    style={{
                                      color: brandColor,
                                      textTransform: "none",
                                      fontWeight: 600,
                                      padding: 0,
                                    }}
                                  >
                                    ADD TO CART
                                  </Button>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Categories Section - 2x2 grid, white background */}
                      <Box style={{ padding: "32px 24px", background: "#fff" }}>
                        <Typography
                          variant="h5"
                          style={{
                            fontWeight: 700,
                            marginBottom: 20,
                            color: "#000",
                          }}
                        >
                          Categories
                        </Typography>
                        <Grid container spacing={2}>
                          {["SHIRTS", "KURTA", "BURQAS", "SAREE"].map(
                            (cat, idx) => (
                              <Grid item xs={6} key={idx}>
                                <Box
                                  style={{
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    position: "relative",
                                    paddingTop: "75%",
                                    background: "#e8e8e8",
                                  }}
                                >
                                  <Box
                                    style={{
                                      position: "absolute",
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      padding: 16,
                                      background:
                                        "linear-gradient(transparent, rgba(0,0,0,0.5))",
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      style={{
                                        color: "#fff",
                                        fontWeight: 700,
                                        marginBottom: 8,
                                      }}
                                    >
                                      {cat}
                                    </Typography>
                                    <Button
                                      size="small"
                                      style={{
                                        background: "#fff",
                                        color: "#000",
                                        textTransform: "none",
                                        fontWeight: 600,
                                      }}
                                    >
                                      View All
                                    </Button>
                                  </Box>
                                </Box>
                              </Grid>
                            )
                          )}
                        </Grid>
                      </Box>

                      {/* Sections */}
                      {sections.map(section => {
                        const sectionProducts = products.filter(product =>
                          section.productIds.includes(product.id)
                        );
                        const showFallback = sectionProducts.length === 0;
                        const previewItems = showFallback
                          ? [1, 2, 3, 4, 5, 6, 7, 8]
                          : sectionProducts;
                        const totalItems = previewItems.length;
                        const startIndex =
                          totalItems > 8
                            ? sectionPreviewIndex[section.id] || 0
                            : 0;
                        const visibleItems =
                          totalItems > 8
                            ? previewItems
                                .concat(previewItems)
                                .slice(startIndex, startIndex + 8)
                            : previewItems;

                        return (
                          <Box
                            key={section.id}
                            ref={el => {
                              if (el) {
                                previewSectionRefs.current[section.id] = el;
                              }
                            }}
                            style={{ padding: "32px 24px", background: "#fff" }}
                          >
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                              }}
                            >
                              <Typography
                                variant="h5"
                                style={{ fontWeight: 700, color: "#000" }}
                              >
                                {section.title || "Section"}
                              </Typography>
                              <Box
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <Button
                                  style={{
                                    color: "#000",
                                    textTransform: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  VIEW ALL
                                </Button>
                                <Button
                                  style={{
                                    background: "#f0f0f0",
                                    color: "#000",
                                    minWidth: 36,
                                    height: 36,
                                  }}
                                  onClick={() =>
                                    handleSectionPreviewPrev(
                                      section.id,
                                      totalItems
                                    )
                                  }
                                  disabled={totalItems <= 8}
                                >
                                  ‹
                                </Button>
                                <Button
                                  style={{
                                    background: "#f0f0f0",
                                    color: "#000",
                                    minWidth: 36,
                                    height: 36,
                                  }}
                                  onClick={() =>
                                    handleSectionPreviewNext(
                                      section.id,
                                      totalItems
                                    )
                                  }
                                  disabled={totalItems <= 8}
                                >
                                  ›
                                </Button>
                              </Box>
                            </Box>
                            <Grid container spacing={2}>
                              {showFallback
                                ? visibleItems.map(item => (
                                    <Grid item xs={6} sm={3} key={item}>
                                      <Box
                                        style={{
                                          background: "#fff",
                                          borderRadius: 8,
                                          overflow: "hidden",
                                          border: "1px solid #eee",
                                        }}
                                      >
                                        <Box
                                          style={{
                                            width: "100%",
                                            paddingTop: "120%",
                                            background: "#f5f5f5",
                                            position: "relative",
                                          }}
                                        >
                                          <Box
                                            style={{
                                              position: "absolute",
                                              top: 8,
                                              left: 8,
                                              background: brandColor,
                                              color: "#fff",
                                              padding: "4px 10px",
                                              borderRadius: 4,
                                              fontSize: "0.7rem",
                                              fontWeight: 600,
                                            }}
                                          >
                                            New
                                          </Box>
                                        </Box>
                                        <Box style={{ padding: 12 }}>
                                          <Typography
                                            variant="body2"
                                            style={{
                                              fontWeight: 600,
                                              marginBottom: 4,
                                            }}
                                          >
                                            Product {item}
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            style={{
                                              color: "#666",
                                              marginBottom: 8,
                                            }}
                                          >
                                            ৳999
                                          </Typography>
                                          <Button
                                            size="small"
                                            style={{
                                              color: brandColor,
                                              textTransform: "none",
                                              fontWeight: 600,
                                              padding: 0,
                                            }}
                                          >
                                            ADD TO CART
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  ))
                                : visibleItems.map(product => (
                                    <Grid item xs={6} sm={3} key={product.id}>
                                      <Box
                                        style={{
                                          background: "#fff",
                                          borderRadius: 8,
                                          overflow: "hidden",
                                          border: "1px solid #eee",
                                        }}
                                      >
                                        <Box
                                          style={{
                                            width: "100%",
                                            paddingTop: "120%",
                                            background: "#f5f5f5",
                                            position: "relative",
                                            backgroundImage: product?.main_image
                                              ? `url(${product.main_image})`
                                              : "none",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                          }}
                                        >
                                          <Box
                                            style={{
                                              position: "absolute",
                                              top: 8,
                                              left: 8,
                                              background: brandColor,
                                              color: "#fff",
                                              padding: "4px 10px",
                                              borderRadius: 4,
                                              fontSize: "0.7rem",
                                              fontWeight: 600,
                                            }}
                                          >
                                            New
                                          </Box>
                                        </Box>
                                        <Box style={{ padding: 12 }}>
                                          <Typography
                                            variant="body2"
                                            style={{
                                              fontWeight: 600,
                                              marginBottom: 4,
                                            }}
                                          >
                                            {product?.product_name || "Product"}
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            style={{
                                              color: "#666",
                                              marginBottom: 8,
                                            }}
                                          >
                                            ৳{product?.price ?? "--"}
                                          </Typography>
                                          <Button
                                            size="small"
                                            style={{
                                              color: brandColor,
                                              textTransform: "none",
                                              fontWeight: 600,
                                              padding: 0,
                                            }}
                                          >
                                            ADD TO CART
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  ))}
                            </Grid>
                          </Box>
                        );
                      })}

                      {/* Secondary CTA Banner - same hero text & button */}
                      <Box
                        style={{
                          padding: "60px 24px",
                          background: `linear-gradient(90deg, #ffd6e0 0%, #e8d4ff 25%, #ffe0c4 50%, #c8e6c9 100%)`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h4"
                          style={{
                            fontWeight: 700,
                            color: "#333",
                            marginBottom: 12,
                          }}
                        >
                          {activeSlide?.title ||
                            "Fit that the speaks before you do."}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{
                            color: "#555",
                            marginBottom: 24,
                            maxWidth: 500,
                          }}
                        >
                          {activeSlide?.subtitle ||
                            "Should you focus on our fit and look or just your style? We'll make it easier, but not that easy for you."}
                        </Typography>
                        {activeSlide?.buttonText && (
                          <Button
                            variant="contained"
                            style={{
                              background: brandColor,
                              color: "#fff",
                              fontWeight: 600,
                              padding: "12px 32px",
                              borderRadius: 4,
                              textTransform: "none",
                            }}
                          >
                            {activeSlide?.buttonText}
                          </Button>
                        )}
                      </Box>

                      {/* Footer - white/light background */}
                      <Box
                        style={{
                          padding: "40px 24px",
                          background: "#fff",
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 700, marginBottom: 8 }}
                            >
                              SHOPPY BOMBAY
                            </Typography>
                            <Box
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 16,
                              }}
                            >
                              <Box
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                }}
                              >
                                f
                              </Box>
                              <Box
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                }}
                              >
                                𝕏
                              </Box>
                              <Box
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                }}
                              >
                                📷
                              </Box>
                              <Box
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                }}
                              >
                                P
                              </Box>
                            </Box>
                            <Typography
                              variant="caption"
                              style={{ color: "#666" }}
                            >
                              © 2025 Shoppy Bombay. All rights reserved.
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography
                              variant="subtitle2"
                              style={{
                                fontWeight: 700,
                                marginBottom: 12,
                                color: "#000",
                              }}
                            >
                              INFORMATION
                            </Typography>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              {["About Us", "Delivery", "Privacy", "Terms"].map(
                                link => (
                                  <a
                                    key={link}
                                    href="#"
                                    style={{
                                      color: "#666",
                                      textDecoration: "none",
                                      fontSize: 14,
                                    }}
                                  >
                                    {link}
                                  </a>
                                )
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography
                              variant="subtitle2"
                              style={{
                                fontWeight: 700,
                                marginBottom: 12,
                                color: "#000",
                              }}
                            >
                              CATEGORIES
                            </Typography>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              {["Mens", "Womens", "Kids"].map(link => (
                                <a
                                  key={link}
                                  href="#"
                                  style={{
                                    color: "#666",
                                    textDecoration: "none",
                                    fontSize: 14,
                                  }}
                                >
                                  {link}
                                </a>
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography
                              variant="subtitle2"
                              style={{
                                fontWeight: 700,
                                marginBottom: 12,
                                color: "#000",
                              }}
                            >
                              SUPPORT
                            </Typography>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              {["Contact", "FAQ"].map(link => (
                                <a
                                  key={link}
                                  href="#"
                                  style={{
                                    color: "#666",
                                    textDecoration: "none",
                                    fontSize: 14,
                                  }}
                                >
                                  {link}
                                </a>
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography
                              variant="subtitle2"
                              style={{
                                fontWeight: 700,
                                marginBottom: 12,
                                color: "#000",
                              }}
                            >
                              HELP
                            </Typography>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              {["Help Center", "Returns"].map(link => (
                                <a
                                  key={link}
                                  href="#"
                                  style={{
                                    color: "#666",
                                    textDecoration: "none",
                                    fontSize: 14,
                                  }}
                                >
                                  {link}
                                </a>
                              ))}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: 16,
                            }}
                          >
                            <Button
                              variant="contained"
                              style={{
                                background: brandColor,
                                color: "#fff",
                                textTransform: "none",
                                padding: "10px 20px",
                                borderRadius: 4,
                              }}
                            >
                              📱 Download app
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right: Form */}
              <Grid
                item
                xs={12}
                md={5}
                style={{ paddingLeft: 48, paddingRight: 16 }}
              >
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Customize Theme Two
                </Typography>
                <Box
                  style={{
                    background: "#fafafa",
                    border: "1px solid #e0e0e0",
                    borderRadius: 10,
                    padding: 24,
                    boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      height: "80vh",
                      overflowY: "auto",
                      paddingRight: 8,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root:not(.MuiOutlinedInput-multiline)":
                        {
                          minHeight: 36,
                        },
                      "& .MuiInputBase-input": {
                        padding: "8px 12px",
                      },
                      "& .MuiSelect-select": {
                        padding: "8px 12px",
                      },
                      "& .MuiButton-root": {
                        minHeight: 32,
                        padding: "6px 12px",
                      },
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box style={groupedPanelStyle}>
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: 600, marginBottom: 4 }}
                          >
                            Brand color
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Optional. Change only the brand color.
                          </Typography>
                          <Box
                            style={{
                              marginTop: 12,
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              {...register("brandColor")}
                              type="color"
                              size="small"
                              style={{ width: 72, height: 44 }}
                              inputProps={{
                                style: {
                                  height: 44,
                                  cursor: "pointer",
                                  padding: 0,
                                },
                              }}
                              onChange={e =>
                                setValue("brandColor", e.target.value)
                              }
                            />
                            <TextField
                              label="Hex color"
                              size="small"
                              fullWidth
                              value={brandColor || ""}
                              onChange={e =>
                                setValue("brandColor", e.target.value)
                              }
                              placeholder="#00a651"
                            />
                          </Box>
                          <Box style={{ marginTop: 12 }}>
                            <Button
                              variant="contained"
                              onClick={handleSaveBrandColor}
                              disabled={isSavingBrand}
                              style={{
                                background: "#00a651",
                                color: "#fff",
                                fontWeight: 600,
                                padding: "8px 16px",
                                minHeight: 36,
                              }}
                            >
                              {isSavingBrand
                                ? "Updating..."
                                : "Change brand color"}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box style={groupedPanelStyle}>
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: 600, marginBottom: 4 }}
                          >
                            Banner slides
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Add up to 4 slides.
                          </Typography>
                          <Box
                            style={{
                              marginTop: 16,
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            {slides.map((slide, index) => (
                              <Box
                                key={slide.id}
                                style={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 8,
                                  padding: 16,
                                  background: "#fff",
                                }}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      style={{ fontWeight: 600 }}
                                    >
                                      Slide {index + 1}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      label="Slide title (optional)"
                                      fullWidth
                                      size="small"
                                      value={slide.title}
                                      onChange={e =>
                                        handleSlideFieldChange(
                                          slide.id,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      label="Slide subtitle (optional)"
                                      fullWidth
                                      size="small"
                                      multiline
                                      rows={2}
                                      value={slide.subtitle}
                                      onChange={e =>
                                        handleSlideFieldChange(
                                          slide.id,
                                          "subtitle",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      label="Image link (optional)"
                                      fullWidth
                                      size="small"
                                      value={slide.imageLink}
                                      onChange={e =>
                                        handleSlideFieldChange(
                                          slide.id,
                                          "imageLink",
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://"
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <label
                                      style={{
                                        display: "block",
                                        marginBottom: 6,
                                        fontWeight: 500,
                                      }}
                                    >
                                      Slide image
                                      <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "#888", marginLeft: 4 }}>
                                        [Max size 5 MB]
                                      </span>
                                    </label>
                                    <TextField
                                      type="file"
                                      fullWidth
                                      size="small"
                                      inputProps={{ accept: "image/*" }}
                                      onChange={event =>
                                        handleSlideImageChange(slide.id, event)
                                      }
                                      inputRef={el => {
                                        if (el) {
                                          heroImageInputRefs.current[slide.id] =
                                            el;
                                        }
                                      }}
                                    />
                                    {(slide.image.previewURL ||
                                      slide.image.uploadUrl) && (
                                      <Box
                                        style={{
                                          marginTop: 8,
                                          padding: 8,
                                          background: "#f5f5f5",
                                          borderRadius: 4,
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                        >
                                          {slide.image.isUploading
                                            ? "Uploading image..."
                                            : slide.image.uploadUrl
                                              ? "Image ready"
                                              : "Image selected"}
                                        </Typography>
                                        <Box style={{ marginTop: 8 }}>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() =>
                                              handleRemoveSlideImage(slide.id)
                                            }
                                            style={{
                                              minHeight: 32,
                                              padding: "6px 12px",
                                            }}
                                          >
                                            Remove image
                                          </Button>
                                        </Box>
                                      </Box>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      label="Button text (optional)"
                                      fullWidth
                                      size="small"
                                      value={slide.buttonText}
                                      onChange={e =>
                                        handleSlideFieldChange(
                                          slide.id,
                                          "buttonText",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      label="Button link (optional)"
                                      fullWidth
                                      size="small"
                                      value={slide.buttonLink}
                                      onChange={e =>
                                        handleSlideFieldChange(
                                          slide.id,
                                          "buttonLink",
                                          e.target.value
                                        )
                                      }
                                      placeholder="https:// or #"
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Box style={{ display: "flex", gap: 8 }}>
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        disabled={slides.length === 1}
                                        onClick={() =>
                                          handleRemoveSlide(slide.id)
                                        }
                                        size="small"
                                        style={{
                                          minHeight: 32,
                                          padding: "6px 12px",
                                        }}
                                      >
                                        Remove slide
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}
                          </Box>
                          <Box
                            style={{ marginTop: 12, display: "flex", gap: 8 }}
                          >
                            <Button
                              variant="outlined"
                              onClick={handleAddSlide}
                              disabled={slides.length >= 4}
                              size="small"
                              style={{ minHeight: 32, padding: "6px 12px" }}
                            >
                              Add slide
                            </Button>
                          </Box>
                          <Box style={{ marginTop: 12 }}>
                            <Button
                              variant="contained"
                              onClick={handleSaveSlides}
                              disabled={isSavingSlides}
                              fullWidth
                              style={{
                                background: "#00a651",
                                color: "#fff",
                                padding: "8px 16px",
                                fontWeight: 600,
                                minHeight: 36,
                              }}
                            >
                              {isSavingSlides
                                ? "Saving..."
                                : "Save banner slides"}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box style={groupedPanelStyle}>
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: 600, marginBottom: 4 }}
                          >
                            Sections
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Add section names and assign products from your
                            list.
                          </Typography>
                          <Box
                            style={{
                              marginTop: 16,
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            {sections.map((section, index) => (
                              <Box
                                key={section.id}
                                style={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 8,
                                  padding: 16,
                                  background: "#fff",
                                }}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      label={`Section name ${index + 1}`}
                                      fullWidth
                                      size="small"
                                      value={section.title}
                                      onChange={e =>
                                        handleSectionTitleChange(
                                          section.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Featured / Eid sale / New Year sale"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      select
                                      label="Select products"
                                      fullWidth
                                      size="small"
                                      SelectProps={{
                                        multiple: true,
                                        value: section.productIds,
                                        onChange: e =>
                                          handleSectionProductsChange(
                                            section.id,
                                            e.target.value
                                          ),
                                        renderValue: selected =>
                                          selected.length
                                            ? `${selected.length} selected`
                                            : "",
                                      }}
                                    >
                                      {isProductsLoading && (
                                        <MenuItem disabled>
                                          Loading products...
                                        </MenuItem>
                                      )}
                                      {!isProductsLoading &&
                                        products.length === 0 && (
                                          <MenuItem disabled>
                                            No products found
                                          </MenuItem>
                                        )}
                                      {products.map(product => (
                                        <MenuItem
                                          key={product.id}
                                          value={product.id}
                                        >
                                          {product?.product_name ||
                                            `#${product.id}`}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                    {section.productIds.length > 0 && (
                                      <Box
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 6,
                                          marginTop: 6,
                                        }}
                                      >
                                        {section.productIds.map(productId => {
                                          const product = products.find(
                                            item => item.id === productId
                                          );
                                          return (
                                            <Chip
                                              key={productId}
                                              label={
                                                product?.product_name ||
                                                productId
                                              }
                                              size="small"
                                              onDelete={() =>
                                                handleSectionProductsChange(
                                                  section.id,
                                                  section.productIds.filter(
                                                    id => id !== productId
                                                  )
                                                )
                                              }
                                            />
                                          );
                                        })}
                                      </Box>
                                    )}
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Box style={{ display: "flex", gap: 8 }}>
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        disabled={deletingSectionId === section.id}
                                        onClick={() =>
                                          handleRemoveSection(section.id)
                                        }
                                        size="small"
                                        style={{
                                          minHeight: 32,
                                          padding: "6px 12px",
                                        }}
                                      >
                                        {deletingSectionId === section.id
                                          ? "Removing..."
                                          : "Remove section"}
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}
                          </Box>
                          <Box
                            style={{ marginTop: 12, display: "flex", gap: 8 }}
                          >
                            <Button
                              variant="outlined"
                              onClick={handleAddSection}
                              size="small"
                              style={{ minHeight: 32, padding: "6px 12px" }}
                            >
                              Add another section
                            </Button>
                          </Box>
                          <Box style={{ marginTop: 12 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              disabled={isSavingSections}
                              onClick={handleSaveSections}
                              style={{
                                background: "#00a651",
                                color: "#fff",
                                padding: "8px 16px",
                                fontWeight: 600,
                                minHeight: 36,
                              }}
                            >
                              {isSavingSections ? "Saving..." : "Save sections"}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
};

export default withAuth(MultiPageThemeEdit, {
  isProtectedRoute: true,
});
