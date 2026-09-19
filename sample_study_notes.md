# Introduction to Neural Networks and Deep Learning

## 1. Perceptrons and Biological Neurons
A perceptron is the simplest artificial neural network unit, invented by Frank Rosenblatt in 1957. It takes multiple binary inputs, multiplies each by a real-valued weight, computes the weighted sum, and outputs 1 if the sum exceeds a certain threshold, and 0 otherwise. Biological neurons inspired this model: dendrites receive signals, the cell body (soma) integrates incoming electrical potentials, and an action potential travels down the axon to transmit signals across synapses to adjacent neurons.

## 2. Multi-Layer Perceptrons (MLPs) and Activation Functions
A single perceptron can only separate linearly separable classes (as proved by Minsky and Papert, highlighting the XOR limitation). Multi-layer perceptrons overcome this by stacking multiple layers: an input layer, one or more hidden layers, and an output layer.
Non-linear activation functions are critical because without them, any combination of linear layers collapses into a single linear transformation:
- **Sigmoid**: Maps inputs to (0, 1). Susceptible to vanishing gradients for large positive or negative inputs.
- **Tanh (Hyperbolic Tangent)**: Zero-centered with output range (-1, 1). Generally converges faster than sigmoid.
- **ReLU (Rectified Linear Unit)**: f(x) = max(0, x). Solves vanishing gradient for positive values and is computationally efficient, though vulnerable to the "dying ReLU" problem.
- **Softmax**: Normalizes logits into a probability distribution over K mutually exclusive classes.

## 3. Forward Propagation and Loss Functions
During forward propagation, input data is passed through the network layer by layer to compute a predicted output.
Loss functions measure how far the prediction deviates from the true target label:
- **Mean Squared Error (MSE)**: Typically used for regression tasks.
- **Cross-Entropy Loss (Log Loss)**: Standard objective function for classification problems, penalizing incorrect predictions with high confidence logarithmically.

## 4. Backpropagation and Gradient Descent
Backpropagation is an efficient algorithm to compute the gradient of the loss function with respect to every weight in the network by applying the chain rule of calculus backward from the output layer to the input layer.
Gradient descent updates the weights in the opposite direction of the gradient:
- **Learning Rate (alpha)**: Determines step size. Too high causes oscillation or divergence; too low results in slow convergence.
- **Stochastic Gradient Descent (SGD)**: Updates weights per single sample, introducing noise that helps escape shallow local minima.
- **Adam (Adaptive Moment Estimation)**: Combines Momentum (moving average of gradients) and RMSprop (moving average of squared gradients) for adaptive learning rates.

## 5. Overfitting and Regularization Techniques
Overfitting occurs when a neural network memorizes training data including noise and fails to generalize to unseen test data:
- **L1/L2 Regularization (Weight Decay)**: Penalizes large weight magnitudes. L1 produces sparse weights; L2 encourages uniformly smaller weights.
- **Dropout**: Randomly deactivates a fraction p of neurons during each training step, preventing co-adaptation of features.
- **Early Stopping**: Halts training once validation loss starts increasing even if training loss continues to decrease.
- **Data Augmentation**: Artificially expands the training dataset using transformations like rotations, cropping, and flips.
