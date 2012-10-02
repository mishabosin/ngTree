/**
 * @ngdoc directive
 * @name ngTree
 *
 * @description
 * The `ngTree` directive instantiates a template once per node in a tree based structure.
 * Each child within a node instantiates this template as well, and recursion continues until
 * a node with no children is encountered.
 *
 * @element ANY
 * @param ngTree - the top level node (root) object
 * @param nodeChildren - the property of the root object that contains the child elements.
 *      Expected to reference an array of objects.
 * @param nodeOrder - used by ngRepeat to set the order in which the nodes are displayed
 *
 * @author mishabosin
 */
angular.module('TreeModule', []).directive('ngTree', function($compile) {
    return {
        transclude: false,
        terminal: true,
        compile: function(element, attr, linker) {
            return function(scope, parentElement, attr) {
                var treeExp = attr.ngTree;
                var childrenExp = attr.nodeChildren;
                var orderExp = attr.nodeOrder;

                scope.$watch(treeExp, function(parentNode){
                    var childrenHtml,
                        repeaterExp,
                        repeater,
                        childScope = scope.$new();
                    childScope[treeExp] = parentNode;

                    // Construct a repeater for the possible children
                    repeaterExp = "<span ng-repeat='"+treeExp+" in "+treeExp+"."+childrenExp+" | orderBy:"+'"'+orderExp+'"'+"'></span>";
                    repeater = angular.element(repeaterExp);
                    // Inject the provided template into the repeater.
                    childrenHtml = repeater.append(parentElement.clone());

                    // Add and compile the result
                    if (parentElement.find("ng-tree-child").length > 0) {
                        // Support modern browsers: <ng-tree-child></ng-tree-child>
                        parentElement.find("ng-tree-child").replaceWith(childrenHtml);
                    } else if (parentElement.find("[ng-tree-child]").length > 0) {
                        // Support ie browsers: <div ng-tree-child></>
                        parentElement.find("[ng-tree-child]").replaceWith(childrenHtml);
                    }
                    $compile(parentElement.contents())(childScope);
                });
            };
        }
    };
});
