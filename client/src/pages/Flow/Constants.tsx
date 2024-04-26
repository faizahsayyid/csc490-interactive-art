export const INTERACTION_COLOR_MAP: object = {
  negate_output_on_input: "#e57373", // Red
  blink_on_input_activation: "#64b5f6", // Blue
  negate_output_on_double_click: "#81c784", // Green
  negate_output_on_hold: "#ba68c8", // Purple
  blink_on_hold: "#ffb74d", // Orange
  blink_on_double_click: "#fff176", // Yellow
  led_strip_on_input_activation: "#f06292", // Pink
  blink_then_off_on_input_activation: "#a1887f", // Brown
};

export const ACTION_TO_DESCRIPTION: object = {
    negate_output_on_input: "Toggle output on/off whenever an input signal is detected.",
    blink_on_input_activation: "Flash the output device briefly when an input signal is received.",
    negate_output_on_double_click: "Toggle output on/off only after detecting two quick input signals.",
    negate_output_on_hold: "Toggle output on/off after as the input is held down.",
    blink_on_hold: "Blinks the output for a duration after input is held.",
    blink_on_double_click: "Blinks the output for a duration after input is double clicked.",
    led_strip_on_input_activation: "Activate an LED strip in response to an input signal.",
    blink_then_off_on_input_activation: "Blinks the output for a duration then toggles it on/off.",
};

export const ACTION_TO_NAME: object = {
    negate_output_on_input: "Toggle Output on Input Activation",
    blink_on_input_activation: "Blink on Input Activation",
    negate_output_on_double_click: "Toggle on Double Activation of Input",
    negate_output_on_hold: "Toggle on Hold of Input",
    blink_on_hold: "Blink on Hold of Input",
    blink_on_double_click: "Blink on Double Activation of Input",
    led_strip_on_input_activation: "Activate LED Strip",
    blink_then_off_on_input_activation: "Blink then Off on Input Activation",
};

export const ARGS_TO_DESCRIPTION: object = {
    hold_time: "Duration input must be held active for the action to trigger.",
    blink_duration: "Duration for which the output device should blink.",
    after_action: "Default state to return to after the primary action. (0: Off, 1: On, 2: Return to previous state)",
    second_click_time: "Time Interval between two activations to trigger the action.",
};
