# Palette Picker BE

By:
[Foster Taylor](https://github.com/foster55f) & [Trisha Langlois](https://github.com/trishalanglois)

## [Production Site](https://mysterious-dusk-17585.herokuapp.com/)

## Project Management Board
[Link to Project Management Board](https://trello.com/b/5k1vY2qi/palette-picker)

## Table of Contents

* GET Endpoints
* POST Endpoints
* DELETE Endpoints
* PATCH Endpoints


## End Points
<details>
  <summary> <code>GET</code> endpoints </summary>

##### 1. All Projects 
GET path:`/api/v1/projects`
- Sample Response (ok) status: 200
- Will return an array of all projects, each as an object.
- Each object will contain the following:
```js
[{
		id: 1,
		title: 'Foster',
		  palettes: [{
            id: 20,
            name: 'trish colors',
            color1: '#F7C59F',
            color2: '#2A324B',
            color3: '#767B91',
            color4: '#C7CCDB',
            color5: '#E1E5EE',
            project_id: 1
        },
        {
            id: 21,
            name: 'foster colors',
            color1: '#57739',
            color2: '#BDD5EA',
            color3: '#F7F7FF',
            color4: '#FE5F55',
            color5: '#495867',
            project_id: 1

        },
        {
            id: 23,
            name:'heather colors',
            color1:'#000000',
            color2:'#363946',
            color3:'#696773',
            color4:'#819595',
            color5:'#B1B6A6',
            project_id: 1
            }]
    },
    {
		id: 2,
		title: 'fruits',
		  palettes: [{
            id: 30,
            name: 'apple colors',
            color1: '#F7C59F',
            color2: '#2A324B',
            color3: '#767B93',
            color4: '#C7CCDG',
            color5: '#E1E5EE',
            project_id: 2
        },
        {
            id: 25,
            name: 'orange colors',
            color1: '#57739',
            color2: '#BDD5E2',
            color3: '#F7F7FF',
            color4: '#FE5F53',
            color5: '#495864',
            project_id: 2

        },
        {
            id: 28,
            name:'grape colors',
            color1:'#000000',
            color2:'#363945',
            color3:'#696772',
            color4:'#819591',
            color5:'#B1B6A6',
            project_id: 2
            }]
	}]
```
- `Sample Response (error) status: 500`
```js
{ error: "Could not find projects" }
```
##### 2. Return all Palettes for a specific project
GET path:`/api/v1/projects/:id/palettes`
- Sample Response (ok) status: 200
- Will return specific palettes referencing a project id.
- Each palette object will contain the following:
```js
{
            id: 23,
            name:'heather colors',
            color1:'#000000',
            color2:'#363946',
            color3:'#696773',
            color4:'#819595',
            color5:'#B1B6A6',
            project_id: 1
            }
```
- `Sample Response (error) status: 404`
```js
{ error: "Could not find project with id of 1. Please try again." }
```

##### 3. A specific project by id
GET path:`/api/v1/projects/:id`
- Sample Response (ok) status: 200
- Will return an object with a specific Project
- Each sighting object will contain the following:
```js
{
		id: 1,
		title: 'Foster',
		  palettes: [{
            id: 20,
            name: 'trish colors',
            color1: '#F7C59F',
            color2: '#2A324B',
            color3: '#767B91',
            color4: '#C7CCDB',
            color5: '#E1E5EE',
            project_id: 1
        },
        {
            id: 21,
            name: 'foster colors',
            color1: '#57739',
            color2: '#BDD5EA',
            color3: '#F7F7FF',
            color4: '#FE5F55',
            color5: '#495867',
            project_id: 1

        },
        {
            id: 23,
            name:'heather colors',
            color1:'#000000',
            color2:'#363946',
            color3:'#696773',
            color4:'#819595',
            color5:'#B1B6A6',
            project_id: 1
            }]
	}
```
- Sample Response (error) status: 404
```js
{ 
  error: "no project found with id 2 found" 
}
```

##### 4. A Palette for a specific palette id
GET path:`/api/v1/projects/:projectId/palettes/:paletteId`
- Sample Response (ok) status: 200
- Will return an object of a palette with a specific id
- Each Palette object will contain the following:
```js
      {
            id: 23,
            name:'heather colors',
            color1:'#000000',
            color2:'#363946',
            color3:'#696773',
            color4:'#819595',
            color5:'#B1B6A6',
            project_id: 1
        }
```
- Sample Response (error) status: 404
```js
{ 
  error: "no palette found with 24 id found" 
}
```
</details>
<details>
  <summary> <code>POST</code> endpoints </summary>

##### 1. Create a Project
POST path:`/api/v1/projects`
This Post requires title. Logic is built in to verify a title is included.
Format of POST body:
```js
{
	title: 'Trish',
	
}
```
- Sample Response (ok) status: 201
```js
{ id: 93, title: 'trish'}
```
- Sample Response (error) status: 422 - When all the parameters are not provided:
```js
{
				error: `The expected format is { title: <String> }. You're missing a ${requiredParameter} property.`
			}
```

##### 2. Create a palette for a specific project
POST path:`/api/v1/projects/:id/palettes`
This Post requires name of palette and 5 colors . Logic is built in to verify name and 5 colors.
Format of POST body:
```js
{
  name: 'foster colors',
    color1: '#12345'
    color2: '#12345'
    color3: '#12345'
    color4: '#12345'
    color5: '#12345'
}
```
- Sample Response (ok) status: 201
```js
{
    id: 1,
  name: 'foster colors',
    color1: '#12345'
    color2: '#12345'
    color3: '#12345'
    color4: '#12345'
    color5: '#12345'
}
```
- Sample Response (error) status: 422 - When all the parameters are not provided:
```js
{
				error: `The expected format is { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a ${requiredParameter} property.`
			}
```

</details>
<details>
  <summary> <code>DELETE</code> endpoints </summary>

##### 1. DELETE A Specific Project
DELETE path:'/api/v1/projects/:id'
- This only requires the id of the Project you want to delete
- Sample Response (ok) status: 201 with message
```js
`Project <projectId> has been successfully deleted.`
```
##### 2. DELETE A Specific palette
DELETE path:'api/v1/projects/:projectId/palettes/:paletteId'
- This only requires the id of the Palette you want to delete
- Sample Response (ok) status: 201 with message
```js
`Palette <paletteId> has been successfully deleted.`
```
</details>
<details>
  <summary> <code>PATCH</code> endpoints </summary>

##### 1. PATCH A Specific Project
PATCH path:'/api/v1/projects/:projectId'
- This requires the id of the Project you want to patch
- Body needs to hold the part of the Project to update
- Sample Response (ok) status: 20 with new title
```js
{title: <title of project>}
```
##### 2. PATCH A Specific Palette
PATCH path:'/api/v1/projects/:projectId/palettes/:paletteId'
- This only requires the id of the Palette you want to patch
- Body needs to hold the part of the Palette to update
- Sample Response (ok) status: 201 with message
```js
{ newName: <name of palette> }
```
</details>