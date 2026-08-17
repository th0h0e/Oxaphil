<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 360 360"
    width="100%"
    height="100%"
  >
    <!-- Poly(2-ethyl-2-oxazoline) - HydroPOx-OH Vector Molecule -->
    <g
      font-family="Inter, sans-serif"
      fill="currentColor"
      stroke="currentColor"
    >

      <!-- Ethyl Group (Top Left) -->
      <!-- Terminal CH3 to CH2 bond -->
      <line
        x1="42.5"
        y1="62.5"
        x2="42.5"
        y2="122.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />
      <!-- CH2 to Carbonyl Carbon bond -->
      <line
        x1="42.5"
        y1="122.5"
        x2="97.5"
        y2="154.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <!-- Carbonyl C=O Double Bond -->
      <!-- Upper line (aligned with ethyl chain inlet) -->
      <line
        x1="93.5"
        y1="150"
        x2="129.5"
        y2="129.2"
        stroke-width="3.5"
        stroke-linecap="round"
      />
      <!-- Lower line (anchored directly to Carbonyl Carbon vertex) -->
      <line
        x1="97.5"
        y1="154.5"
        x2="133.5"
        y2="133.7"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <!-- Oxygen Atom Label 'O' -->
      <text
        x="150.5"
        y="130.5"
        font-size="28"
        font-weight="bold"
        text-anchor="middle"
        dominant-baseline="central"
        stroke="none"
      >O</text>

      <!-- Carbonyl Carbon to Nitrogen Bond -->
      <line
        x1="97.5"
        y1="154.5"
        x2="97.5"
        y2="195.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <!-- Polymer Initiator Bond (Left incoming line passing through bracket) -->
      <line
        x1="17.5"
        y1="258.5"
        x2="82.5"
        y2="220.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <!-- Nitrogen Atom Label 'N' -->
      <text
        x="97.5"
        y="212.5"
        font-size="28"
        font-weight="bold"
        text-anchor="middle"
        dominant-baseline="central"
        stroke="none"
      >N</text>

      <!-- Polymer Backbone Bonds -->
      <!-- N to CH2 vertex 1 -->
      <line
        x1="112.5"
        y1="220.5"
        x2="167.5"
        y2="252.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />
      <!-- CH2 vertex 1 to CH2 vertex 2 -->
      <line
        x1="167.5"
        y1="252.5"
        x2="227.5"
        y2="217.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />
      <!-- CH2 vertex 2 to terminal OH (passing through bracket) -->
      <line
        x1="227.5"
        y1="217.5"
        x2="292.5"
        y2="255.5"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <!-- Terminal Hydroxyl Group Label 'OH' -->
      <text
        x="314.5"
        y="262.5"
        font-size="28"
        font-weight="bold"
        text-anchor="start"
        dominant-baseline="central"
        stroke="none"
      >OH</text>

      <!-- Polymer Repeating Unit Brackets -->
      <!-- Left Bracket [ -->
      <path
        d="M 60.5,162.5 H 48.5 V 272.5 H 60.5"
        fill="none"
        stroke-width="1.5"
        stroke-linecap="square"
        stroke-linejoin="miter"
      />

      <!-- Right Bracket ] -->
      <path
        d="M 252.5,162.5 H 264.5 V 272.5 H 252.5"
        fill="none"
        stroke-width="1.5"
        stroke-linecap="square"
        stroke-linejoin="miter"
      />

      <!-- Repeat Count Subscript (e.g. 40 or n) -->
      <text
        x="270.5"
        y="287.5"
        font-size="20"
        font-weight="600"
        text-anchor="start"
        dominant-baseline="central"
        stroke="none"
      >n</text>

    </g>
  </svg>
</template>
