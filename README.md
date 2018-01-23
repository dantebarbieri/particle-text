## particle-text

This is a project for the 2018 DI Team "Party Animals" at The Academy of Science and Technology at College Park High School. This project generates a set of `Word` objects from a JSON Object and then generates a set of `Seeker`s for each word.

A `Word` Object has a:
- `pos` - Position of the Word (Centered)
- `tSize` - Size of the Text
- `text` - The Text Itself
- `rot` - The  Angle of Rotation of the Word (in Radians)
- `color` - A Color Object Defined by the Color Class
- `resolution` - The Number of Dots per Letter (controls Dot Size)
- `points` - The list of `Seeker`s

A `Seeker` Object has a:
- `pos` - Position of the Seeker (Centered)
- `vel` - Velocity of the Seeker
- `acc` - Acceleration of the Seeker
- `target` - Location the Seeker is steering towards

`Seeker`s stop when they reach their desired position so as to reduce the number of `Seeker.prototype.update()` calls required. A big goal would be to make the `Seeker.prototype.draw()` code more efficient. This is the primary thing that slows the processing of the code.

This code should be live [here](http://dantebarbieri.com/party_animals/). Note: This site is blocked on most school networks I know of for the crime of hosting games I've programmed like [PONG](http://dantebarbieri.com/pong/) and [Snake](http://dantebarbieri.com/snakegame/).
