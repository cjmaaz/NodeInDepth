# Buffers : Explained

### The problem that buffers into existence

---

Early computes ran into 3 stubborn realities:

1. Different speeds everywhere:
   - CPU Speed : Very very fast
   - RAM Speed : Very fast
   - Disk Speed : Fast
   - Network Speed : Unpredictable
2. Devices don't speak in neat chunks:
   - A disk might deliver data in blocks
   - A program might want data in bytes
   - A network might exchange date in packets
3. Stopping CPUs are expensive

And because of above scenarios, without a buffer, a temporary storage for the data exchange and processing, system would:

- Stalls constantly
- Waste CPU cycles
- Drop data

> Buffers were invented to decouple timing.

Buffer is a region of memory used to store data temporarily while it is being moved from one place to another.

TODO: More info to be added here based on comments and code present in the js file in the current directory.

TODO: More examples of buffer and related methods should be added into current directory.
