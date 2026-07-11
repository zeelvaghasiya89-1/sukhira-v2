"use client";
import React, { useState } from 'react';

export default function PHVisualizer() {
  const [phValue, setPhValue] = useState(7.0);

  // Smooth linear color interpolation (lerp)
  const getPHColor = (val) => {
    // val goes from 3.0 to 7.0
    // We compute a progress ratio t from 0 (at pH 7) to 1 (at pH 3)
    const t = (7.0 - val) / 4.0;
    
    // Interpolate channels:
    // Red: 27 -> 236
    // Green: 35 -> 72
    // Blue: 64 -> 153
    const r = Math.round(27 + (236 - 27) * t);
    const g = Math.round(35 + (72 - 35) * t);
    const b = Math.round(64 + (153 - 64) * t);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Get description of pH state based on ranges
  const getPHStateDescription = (val) => {
    if (val >= 6.5) return { label: 'Neutral (Water) - pH ' + val.toFixed(1), desc: 'Natural extraction displays a deep botanical blue hue.' };
    if (val >= 5.5) return { label: 'Slightly Acidic - pH ' + val.toFixed(1), desc: 'Adding a drop of honey or honey-bush shifts the color slightly.' };
    if (val >= 4.5) return { label: 'Acidic - pH ' + val.toFixed(1), desc: 'Transitioning to violet as hydrogen ion concentrations shift.' };
    if (val >= 3.5) return { label: 'Highly Acidic - pH ' + val.toFixed(1), desc: 'A splash of lemon juice starts the vivid transformation.' };
    return { label: 'Acidic (Lemon Juice) - pH ' + val.toFixed(1), desc: 'Complete structural modification of anthocyanin molecules reveals a bright magenta/pink hue!' };
  };

  const state = getPHStateDescription(phValue);
  const liquidColor = getPHColor(phValue);

  return (
    <div className="ph-visualizer-container" style={{
      marginTop: '48px',
      backgroundColor: '#ffffff', // Light background for contrast
      border: '1px solid rgba(166, 179, 213, 0.25)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: 'var(--shadow-small)'
    }}>
      <span className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
        Interactive Chemistry
      </span>
      <h3 className="h3-ds" style={{ fontSize: '24px', color: 'var(--color-indigo-950)', marginBottom: '16px' }}>
        Phyto-Chemistry: pH Sensitivity
      </h3>
      <p className="small-ds" style={{ color: 'var(--color-stone-700)', marginBottom: '32px', lineHeight: '1.6' }}>
        Butterfly Pea blossoms contain **anthocyanins** (specifically *delphinidin*). Drag the pH meter smoothly to simulate adding lemon juice (citric acid), which alters the molecular structure and shifts the color spectrum.
      </p>

      {/* Visual Cup Graphic */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          position: 'relative',
          width: '120px',
          height: '140px',
          border: '3px solid var(--color-indigo-950)',
          borderRadius: '0 0 40px 40px',
          borderTop: 'none',
          padding: '10px',
          display: 'flex',
          alignItems: 'flex-end',
          flexShrink: 0
        }}>
          {/* Handle */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '-32px',
            width: '32px',
            height: '60px',
            border: '3px solid var(--color-indigo-950)',
            borderRadius: '0 20px 20px 0',
            borderLeft: 'none'
          }} />
          
          {/* Liquid */}
          <div style={{
            width: '100%',
            height: '80%',
            backgroundColor: liquidColor,
            borderRadius: '0 0 30px 30px',
            transition: 'background-color 0.1s linear',
            opacity: 0.95,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Liquid surface wave */}
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: 0,
              width: '100%',
              height: '12px',
              backgroundColor: liquidColor,
              borderRadius: '50%',
              opacity: 0.8,
              transition: 'background-color 0.1s linear'
            }} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          {/* pH Indicator Slider */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-accent-hibiscus)' }}>pH 3.0 (Acidic)</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-indigo-950)' }}>Active pH: {phValue.toFixed(2)}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-indigo-600)' }}>pH 7.0 (Neutral)</span>
          </div>

          <input 
            type="range" 
            min="3.0" 
            max="7.0" 
            step="0.02"
            value={phValue} 
            onChange={(e) => setPhValue(parseFloat(e.target.value))}
            className="ph-slider-input"
            style={{
              outline: 'none',
              transition: 'all 0.2s',
              background: 'linear-gradient(to right, #ec4899 0%, #7c3aed 25%, #5d6fb3 50%, #23377a 75%, #1b2340 100%)' // Corrected gradient direction
            }}
          />

          <div style={{ marginTop: '16px' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: 'var(--color-indigo-100)',
              color: 'var(--color-indigo-950)',
              marginBottom: '8px'
            }}>
              {state.label}
            </span>
            <p className="caption-ds" style={{ color: 'var(--color-stone-700)', lineHeight: '1.5' }}>
              {state.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
